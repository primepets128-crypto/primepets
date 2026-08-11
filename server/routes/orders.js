const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST create new order (storefront checkout)
router.post('/', async (req, res) => {
  try {
    const {
      customerName, customerPhone, customerAddress,
      items, total, paymentMethod, razorpayOrderId,
      razorpayPaymentId, notes
    } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        total: parseFloat(total),
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' && razorpayPaymentId ? 'PAID' : 'PENDING',
        status: 'PENDING',
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        notes: notes || null
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update order status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE order (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
