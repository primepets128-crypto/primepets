const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all coupons
router.get('/', async (req, res) => {
  try {
    let coupons = await prisma.coupon.findMany({ orderBy: { id: 'asc' } });
    if (coupons.length === 0) {
      const defaultCoupons = [
        { title: 'PAWDAY SALE', sub: 'Up to 60% Off Sitewide', expiry: '2 Days Left', grad: 'from-[#d07e20] to-[#a65d14]', emoji: '🐾', code: 'PAWDAY60', isActive: true },
        { title: 'MONSOON MANIA', sub: '35% Off Grooming & Wear', expiry: '5 Days Left', grad: 'from-[#0F9B8E] to-[#007CF0]', emoji: '🌧️', code: 'MONSOON35', isActive: true },
        { title: 'FIRST ORDER', sub: 'Extra 15% Off for New Users', expiry: 'Ongoing', grad: 'from-[#6C3FC8] to-[#E040FB]', emoji: '🎁', code: 'NEWPET15', isActive: true },
        { title: 'WEEKEND DEAL', sub: '20% Off All Accessories', expiry: '3 Days Left', grad: 'from-[#E91E63] to-[#9C27B0]', emoji: '🎀', code: 'WEEKEND20', isActive: true },
      ];
      await prisma.coupon.createMany({ data: defaultCoupons });
      coupons = await prisma.coupon.findMany({ orderBy: { id: 'asc' } });
    }
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
