const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET all banners
router.get('/', async (req, res) => {
  try {
    const banners = await prisma.banner.findMany();
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// POST new banner
router.post('/', async (req, res) => {
  try {
    const { mediaUrl, link } = req.body;
    
    const banner = await prisma.banner.create({
      data: {
        mediaUrl: mediaUrl || '',
        link: link || ''
      }
    });
    
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// PUT update banner
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaUrl, link } = req.body;
    
    const banner = await prisma.banner.update({
      where: { id: Number(id) },
      data: {
        mediaUrl: mediaUrl || '',
        link: link || ''
      }
    });
    
    res.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// DELETE banner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

module.exports = router;
