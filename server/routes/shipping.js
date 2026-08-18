const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { adminAuth } = require('../firebaseAdmin');
const axios = require('axios');

// Middleware to verify Firebase token and ensure Admin role
const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({ where: { firebaseId: decodedToken.uid } });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET DTDC settings
router.get('/dtdc', verifyAdminToken, async (req, res) => {
  try {
    let settings = await prisma.shippingSetting.findUnique({
      where: { provider: 'DTDC' }
    });
    if (!settings) {
      settings = await prisma.shippingSetting.create({
        data: { provider: 'DTDC', isActive: false }
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching DTDC settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT DTDC settings
router.put('/dtdc', verifyAdminToken, async (req, res) => {
  try {
    const { username, password, apiKey, isActive, senderName, senderPhone, senderAddress, senderPincode, senderCity, senderState } = req.body;
    const settings = await prisma.shippingSetting.upsert({
      where: { provider: 'DTDC' },
      update: {
        username: username || null,
        password: password || null,
        apiKey: apiKey || null,
        isActive: isActive !== undefined ? isActive : true,
        senderName: senderName || null,
        senderPhone: senderPhone || null,
        senderAddress: senderAddress || null,
        senderPincode: senderPincode || null,
        senderCity: senderCity || null,
        senderState: senderState || null
      },
      create: {
        provider: 'DTDC',
        username: username || null,
        password: password || null,
        apiKey: apiKey || null,
        isActive: isActive !== undefined ? isActive : true,
        senderName: senderName || null,
        senderPhone: senderPhone || null,
        senderAddress: senderAddress || null,
        senderPincode: senderPincode || null,
        senderCity: senderCity || null,
        senderState: senderState || null
      }
    });
    res.json(settings);
  } catch (error) {
    console.error('Error updating DTDC settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST test DTDC connection (API Indicator)
router.post('/dtdc/test', verifyAdminToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ success: false, message: 'Missing API Key' });
    }

    // Ping the PX Shipping Label API to verify the API key is active
    try {
      await axios.get('https://pxapi.dtdc.in/api/customer/integration/consignment/shippinglabel/stream?reference_number=TEST_API_CONNECTION&label_code=SHIP_LABEL_4X6', {
        headers: {
          'api-key': apiKey
        }
      });
      // If 200 OK (unlikely with a fake tracking number but possible)
      return res.json({ success: true, message: 'Successfully connected to DTDC API' });
    } catch (apiError) {
      if (apiError.response && apiError.response.status === 401) {
        return res.status(401).json({ success: false, message: 'Invalid API Key - Authentication Failed' });
      } else if (apiError.response && apiError.response.status === 400) {
        // A 400 means auth passed but the tracking number (TEST_API_CONNECTION) was not found. This means the key works!
        return res.json({ success: true, message: 'API Key Verified successfully' });
      } else {
         console.error('DTDC API Test unexpected response:', apiError.response?.data || apiError.message);
         return res.status(500).json({ success: false, message: 'API connected but returned unexpected error' });
      }
    }
  } catch (error) {
    console.error('Error testing DTDC connection:', error);
    res.status(500).json({ success: false, message: 'Failed to connect to DTDC API' });
  }
});

// POST check pincode
router.post('/dtdc/pincode', verifyAdminToken, async (req, res) => {
  try {
    const { origin, dest } = req.body;
    if (!origin || !dest) {
      return res.status(400).json({ success: false, message: 'Origin and Destination pincodes required' });
    }

    const settings = await prisma.shippingSetting.findUnique({ where: { provider: 'DTDC' } });
    if (!settings || !settings.apiKey) {
      return res.status(400).json({ success: false, message: 'DTDC API Key not configured' });
    }

    const { data } = await axios.post('https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall', {
      orgPincode: origin,
      desPincode: dest
    }, {
      headers: { 'api-key': settings.apiKey }
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error checking pincode:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to check pincode with DTDC' });
  }
});

// POST book shipment
router.post('/dtdc/book', verifyAdminToken, async (req, res) => {
  try {
    const { orderId, weight, length, width, height } = req.body;
    
    // 1. Get Order
    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // 2. Get Shipping Settings
    const settings = await prisma.shippingSetting.findUnique({ where: { provider: 'DTDC' } });
    if (!settings || !settings.apiKey || !settings.username) {
      return res.status(400).json({ success: false, message: 'DTDC API not fully configured' });
    }
    if (!settings.senderName || !settings.senderPincode || !settings.senderPhone) {
      return res.status(400).json({ success: false, message: 'Sender details (Pickup Address) not fully configured in settings' });
    }

    // Parse items for description
    let items = [];
    try { items = JSON.parse(order.items); } catch(e) {}
    const description = items.map(i => i.productName || i.name).join(', ').substring(0, 250) || 'Pet Supplies';

    // 3. Build Payload
    const payload = {
      consignments: [
        {
          customer_code: settings.username, // Usually customer code is the username
          service_type_id: "B2C PREMIUM", // Using a default B2C service
          load_type: "NON-DOCUMENT",
          consignment_type: "Forward",
          description: description,
          dimension_unit: "cm",
          length: (length || 10).toString(),
          width: (width || 10).toString(),
          height: (height || 10).toString(),
          weight_unit: "kg",
          weight: (weight || 1).toString(),
          declared_value: order.totalAmount.toString(),
          num_pieces: "1",
          customer_reference_number: order.id.toString(),
          is_risk_surcharge_applicable: "false",
          origin_details: {
            name: settings.senderName,
            phone: settings.senderPhone,
            address_line_1: settings.senderAddress || 'Address',
            address_line_2: "",
            pincode: settings.senderPincode,
            city: settings.senderCity || 'City',
            state: settings.senderState || 'State'
          },
          destination_details: {
            name: order.customerName || 'Customer',
            phone: order.customerPhone || '0000000000',
            address_line_1: order.deliveryAddress || 'Address',
            address_line_2: "",
            pincode: order.deliveryAddress?.match(/\\d{6}/)?.[0] || '110001', // extract pincode from address if possible
            city: order.deliveryAddress?.split(',').slice(-2, -1)[0]?.trim() || 'City',
            state: 'State' // Ideally extracted from address
          }
        }
      ]
    };

    // If COD
    if (order.paymentMethod === 'COD') {
      payload.consignments[0].cod_collection_mode = 'CASH';
      payload.consignments[0].cod_amount = order.totalAmount.toString();
    }

    // 4. Call DTDC API
    const { data } = await axios.post('https://pxapi.dtdc.in/api/customer/integration/consignment/softdata', payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': settings.apiKey
      }
    });

    if (data && data.status === 'OK' && data.data && data.data[0]) {
      const responseNode = data.data[0];
      if (responseNode.success) {
        // Successfully booked!
        const awb = responseNode.reference_number;
        // 5. Update Order with AWB
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'SHIPPED', // Or leave as confirmed
            // ideally we should save AWB in order table, but we don't have a column for it. We can append to address or add to items?
            // Actually, we can add a trackingNumber column to Order table later.
          }
        });
        
        return res.json({ success: true, message: 'Shipment booked successfully!', awb });
      } else {
        return res.status(400).json({ success: false, message: responseNode.error_message || 'Failed to book shipment' });
      }
    }

    res.status(400).json({ success: false, message: 'Unexpected response from DTDC' });

  } catch (error) {
    console.error('Error booking shipment:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to book shipment with DTDC' });
  }
});

module.exports = router;
