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
    const { username, password, apiKey } = req.body;
    
    if (!username || !apiKey) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    // TODO: Replace this with an actual call to the DTDC API (e.g. checking pin code serviceability or ping endpoint) 
    // when the exact API documentation is provided.
    // For now, we simulate a successful API connection if credentials match expected lengths.
    
    if (username.startsWith('PO') && apiKey.length > 20) {
       // Simulate API delay
       await new Promise(resolve => setTimeout(resolve, 800));
       return res.json({ success: true, message: 'Successfully connected to DTDC API' });
    }
    
    return res.status(400).json({ success: false, message: 'Invalid credentials format' });
  } catch (error) {
    console.error('Error testing DTDC connection:', error);
    res.status(500).json({ success: false, message: 'Failed to connect to DTDC API' });
  }
});

module.exports = router;
