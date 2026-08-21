const express = require('express');
const router = express.Router();
const { adminAuth } = require('../firebaseAdmin');
const prisma = require('../db');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.post('/check', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/me', verifyToken, async (req, res) => {
  try {
    const email = req.user.email?.toLowerCase();
    
    // 1. Try finding by firebaseId
    let user = await prisma.user.findUnique({
      where: { firebaseId: req.user.uid }
    });

    // 2. If not found by firebaseId, try finding by email
    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (user) {
        // Update user to link their firebaseId
        user = await prisma.user.update({
          where: { id: user.id },
          data: { firebaseId: req.user.uid }
        });
      }
    }

    // 3. If still not found, create new user
    if (!user) {
      const count = await prisma.user.count();
      const role = (count === 0 || email === 'admin@primepets.com') ? 'admin' : 'user';
      
      user = await prisma.user.create({
        data: {
          firebaseId: req.user.uid,
          email: email,
          name: req.user.name || email.split('@')[0],
          role
        }
      });
    }

    // Ensure admin email always has admin role in database
    if (email === 'admin@primepets.com' && user.role !== 'admin') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
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
    const userEmail = (email || req.user.email)?.toLowerCase();
    
    // Check if user already exists
    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseId: req.user.uid },
          { email: userEmail }
        ]
      }
    });

    if (existingUser) {
      const role = (existingUser.role === 'admin' || userEmail === 'admin@primepets.com') ? 'admin' : existingUser.role;
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firebaseId: req.user.uid,
          name: name || existingUser.name,
          email: userEmail,
          role
        }
      });
      return res.json({ user });
    }

    // Check if user is first to register, make admin
    const count = await prisma.user.count();
    const role = (count === 0 || userEmail === 'admin@primepets.com') ? 'admin' : 'user';

    const user = await prisma.user.create({
      data: {
        firebaseId: req.user.uid,
        email: userEmail,
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
