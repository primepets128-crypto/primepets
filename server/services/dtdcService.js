const axios = require('axios');
const prisma = require('../db');

async function bookDTDCShipment(orderId, overrides = {}) {
  const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
  if (!order) throw new Error('Order not found');

  const settings = await prisma.shippingSetting.findUnique({ where: { provider: 'DTDC' } });
  if (!settings || !settings.apiKey || !settings.username) {
    throw new Error('DTDC API not fully configured');
  }
  if (!settings.senderName || !settings.senderPincode || !settings.senderPhone) {
    throw new Error('Sender details (Pickup Address) not fully configured in settings');
  }

  let items = [];
  try { items = JSON.parse(order.items); } catch(e) {}
  const description = items.map(i => i.productName || i.name).join(', ').substring(0, 250) || 'Pet Supplies';

  const payload = {
    consignments: [
      {
        customer_code: settings.username,
        service_type_id: 'B2C SMART EXPRESS',
        load_type: 'NON-DOCUMENT',
        consignment_type: 'Forward',
        description: description,
        dimension_unit: 'cm',
        length: (overrides.length || 10).toString(),
        width: (overrides.width || 10).toString(),
        height: (overrides.height || 10).toString(),
        weight_unit: 'kg',
        weight: (overrides.weight || 1).toString(),
        declared_value: order.total.toString(),
        num_pieces: '1',
        customer_reference_number: order.id.toString(),
        commodity_id: 'pet-supplies',
        is_risk_surcharge_applicable: 'false',
        origin_details: {
          name: settings.senderName,
          phone: settings.senderPhone,
          address_line_1: settings.senderAddress || 'Address',
          address_line_2: '',
          pincode: settings.senderPincode,
          city: settings.senderCity || 'City',
          state: settings.senderState || 'State'
        },
        destination_details: {
          name: order.customerName || 'Customer',
          phone: order.customerPhone || '0000000000',
          address_line_1: order.customerAddress || 'Address',
          address_line_2: '',
          pincode: order.customerAddress?.match(/\d{6}/)?.[0] || '110001',
          city: order.customerAddress?.split(',').slice(-2, -1)[0]?.trim() || 'City',
          state: 'State'
        }
      }
    ]
  };

  if (order.paymentMethod === 'COD') {
    payload.consignments[0].cod_collection_mode = 'CASH';
    payload.consignments[0].cod_amount = order.total.toString();
  }

  const { data } = await axios.post('https://dtdcapi.shipsy.io/api/customer/integration/consignment/softdata', payload, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': settings.apiKey
    }
  });

  if (data && data.status === 'OK' && data.data && data.data[0]) {
    const responseNode = data.data[0];
    if (responseNode.success) {
      const awb = responseNode.reference_number;
      await prisma.order.update({
        where: { id: order.id },
        data: {
          notes: order.notes ? order.notes + ' | AWB: ' + awb : 'AWB: ' + awb
        }
      });
      return { success: true, awb, message: 'Shipment booked successfully!' };
    } else {
      throw new Error(responseNode.error_message || 'Failed to book shipment');
    }
  }

  throw new Error('Unexpected response from DTDC');
}

module.exports = { bookDTDCShipment };
