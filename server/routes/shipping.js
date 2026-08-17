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
    const { username, password, apiKey, isActive } = req.body;
    const settings = await prisma.shippingSetting.upsert({
      where: { provider: 'DTDC' },
      update: {
        username: username || null,
        password: password || null,
        apiKey: apiKey || null,
        isActive: isActive !== undefined ? isActive : true
      },
      create: {
        provider: 'DTDC',
        username: username || null,
        password: password || null,
        apiKey: apiKey || null,
        isActive: isActive !== undefined ? isActive : true
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

module.exports = router;
