const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all customers and leads
router.get('/', async (req, res) => {
  try {
    // 1. Fetch registered users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch visitors with names (Leads)
    const visitors = await prisma.visitor.findMany({
      where: {
        name: { not: null }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Fetch all orders to extract buyers who might not have registered
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const customersMap = new Map();

    const addCustomer = (key, data) => {
      if (!key) return;
      if (customersMap.has(key)) {
        const existing = customersMap.get(key);
        // Prefer 'admin' or 'customer' over 'lead'
        if (data.role === 'admin' || (data.role === 'customer' && existing.role !== 'admin')) {
           existing.role = data.role;
        }
        if (!existing.email && data.email) existing.email = data.email;
        if (!existing.name && data.name) existing.name = data.name;
        // Keep the earliest creation date to show when they first joined/interacted
        if (new Date(data.createdAt) < new Date(existing.createdAt)) {
           existing.createdAt = data.createdAt;
        }
      } else {
        customersMap.set(key, { ...data });
      }
    };

    // Process Users
    users.forEach(u => {
      addCustomer(u.phone || u.email, {
        id: `user_${u.id}`,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
        type: 'Registered User'
      });
    });

    // Process Orders
    orders.forEach(o => {
      if (o.customerPhone) {
        addCustomer(o.customerPhone, {
          id: `order_cust_${o.id}`,
          name: o.customerName,
          email: null, // Orders don't store email currently
          phone: o.customerPhone,
          role: 'customer',
          createdAt: o.createdAt,
          type: 'Purchasing Customer'
        });
      }
    });

    // Process Visitors (Leads)
    visitors.forEach(v => {
      addCustomer(v.phone || `visitor_${v.id}`, {
        id: `lead_${v.id}`,
        name: v.name,
        email: null,
        phone: v.phone,
        role: 'lead',
        createdAt: v.createdAt,
        type: 'Captured Lead'
      });
    });

    // Convert map to array and sort by date descending (newest first)
    const combined = Array.from(customersMap.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(combined);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
