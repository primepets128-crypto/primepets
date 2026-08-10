const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const prisma = require('../db');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.post('/me', verifyToken, async (req, res) => {
  try {
    // Fetch user from DB based on firebase UID
    let user = await prisma.user.findUnique({
      where: { firebaseId: req.user.uid }
    });

    if (!user) {
      // If user logs in via Google Auth for first time without /register, create them
      user = await prisma.user.create({
        data: {
          firebaseId: req.user.uid,
          email: req.user.email,
          name: req.user.name || req.user.email.split('@')[0],
        }
      });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if user is first to register, make admin
    const count = await prisma.user.count();
    const role = count === 0 ? 'admin' : 'user';

    const user = await prisma.user.create({
      data: {
        firebaseId: req.user.uid,
        email: email || req.user.email,
        name: name || req.user.name || 'User',
        role
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user in DB' });
  }
});

module.exports = router;
