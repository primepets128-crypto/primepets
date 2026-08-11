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

    // Map users
    const formattedUsers = users.map(u => ({
      id: `user_${u.id}`,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
      type: 'Registered User'
    }));

    // Map visitors
    const formattedVisitors = visitors.map(v => ({
      id: `lead_${v.id}`,
      name: v.name,
      email: null,
      phone: v.phone,
      role: 'lead',
      createdAt: v.createdAt,
      type: 'Captured Lead'
    }));

    // Combine and sort by date
    const combined = [...formattedUsers, ...formattedVisitors].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(combined);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
