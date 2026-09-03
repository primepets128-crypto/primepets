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
      visitorId, customerName, customerEmail, customerPhone, customerAddress,
      items, total, paymentMethod, razorpayOrderId,
      razorpayPaymentId, notes
    } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = await prisma.order.create({
      data: {
        visitorId: visitorId && visitorId !== 'anonymous' ? visitorId : null,
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

    // If visitorId is provided, update the visitor profile with their actual name & phone
    if (visitorId && visitorId !== 'anonymous') {
      await prisma.visitor.updateMany({
        where: { visitorId },
        data: {
          name: customerName,
          phone: customerPhone
        }
      }).catch(e => console.error("Error linking visitor to order:", e.message));
    }

    // --- SEND ORDER NOTIFICATION EMAIL ---
    try {
      const { sendEmail } = require('../utils/email');
      const orderItems = typeof items === 'string' ? JSON.parse(items) : items;
      
      let itemsHtml = orderItems.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.qty || item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price || item.sellingPrice}</td>
        </tr>
      `).join('');

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #d07e20; text-align: center;">Order Confirmed! 🐾</h2>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>Thank you for shopping at Prime Pets! Your order has been successfully placed.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${customerAddress}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #fff7ed; color: #d07e20;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px; text-align: right; font-weight: bold;">Grand Total:</td>
                <td style="padding: 10px; font-weight: bold; color: #d07e20;">₹${total}</td>
              </tr>
            </tfoot>
          </table>
          <p style="text-align: center; color: #666;">We will notify you once your order is shipped!</p>
        </div>
      `;

      // Send to the customer's email if provided
      if (customerEmail) {
        await sendEmail({
          to: customerEmail, 
          subject: `Order Confirmation - Prime Pets #${order.id}`,
          html: emailHtml
        });
      }
      
      // Sending an alert to the admin
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Order Alert! #${order.id}`,
        text: `You have received a new order from ${customerName} for ₹${total}.`
      });
    } catch (emailErr) {
      console.error("Failed to send order email:", emailErr);
    }

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

    // Auto-book DTDC shipment if status changed to CONFIRMED
    if (status === 'CONFIRMED') {
      try {
        const { bookDTDCShipment } = require('../services/dtdcService');
        // Book with default dimensions/weight. 
        await bookDTDCShipment(order.id, {});
      } catch (dtdcError) {
        console.error('Failed to auto-book DTDC shipment:', dtdcError.message);
        // We log the error but don't fail the order status update.
        // We can append a note to the order so the admin knows it failed.
        await prisma.order.update({
          where: { id: parseInt(id) },
          data: {
            notes: order.notes 
              ? order.notes + ' | DTDC Auto-book failed: ' + dtdcError.message 
              : 'DTDC Auto-book failed: ' + dtdcError.message
          }
        });
      }
    }

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
