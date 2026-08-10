const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET all deals
router.get('/', async (req, res) => {
  try {
    const deals = await prisma.deal.findMany();
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// POST new deal
router.post('/', async (req, res) => {
  try {
    const { title, sub, badge, tag, img, grad, bg, border, save } = req.body;
    
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/deals');

    const deal = await prisma.deal.create({
      data: {
        title,
        sub: sub || '',
        badge: badge || '',
        tag: tag || '',
        img: uploadedImg || '',
        grad: grad || '',
        bg: bg || '',
        border: border || '',
        save: save || ''
      }
    });
    
    res.status(201).json(deal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// PUT update deal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sub, badge, tag, img, grad, bg, border, save } = req.body;
    
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/deals');

    const deal = await prisma.deal.update({
      where: { id: Number(id) },
      data: {
        title,
        sub: sub || '',
        badge: badge || '',
        tag: tag || '',
        img: uploadedImg || '',
        grad: grad || '',
        bg: bg || '',
        border: border || '',
        save: save || ''
      }
    });
    
    res.json(deal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// DELETE deal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.deal.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

module.exports = router;
