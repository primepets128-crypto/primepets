const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { id: 'asc' } });
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// POST new coupon
router.post('/', async (req, res) => {
  try {
    const { title, sub, code, expiry, emoji, grad, isActive } = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        title: title || '',
        sub: sub || '',
        code: code || '',
        expiry: expiry || 'Ongoing',
        emoji: emoji || '🐾',
        grad: grad || 'from-[#d07e20] to-[#a65d14]',
        isActive: isActive !== false,
      }
    });
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// PUT update coupon
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sub, code, expiry, emoji, grad, isActive } = req.body;
    const coupon = await prisma.coupon.update({
      where: { id: Number(id) },
      data: {
        title: title || '',
        sub: sub || '',
        code: code || '',
        expiry: expiry || 'Ongoing',
        emoji: emoji || '🐾',
        grad: grad || 'from-[#d07e20] to-[#a65d14]',
        isActive: isActive !== false,
      }
    });
    res.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// DELETE coupon
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

module.exports = router;
