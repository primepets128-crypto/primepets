const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET all deal categories
router.get('/', async (req, res) => {
  try {
    let dealCategories = await prisma.dealCategory.findMany({ orderBy: { id: 'asc' } });
    
    // Auto-seed default deal categories if empty
    if (dealCategories.length === 0) {
      console.log('Seeding default deal categories...');
      const DEFAULT_DEAL_CATEGORIES = [
        { label: 'DOG FOOD', off: '30% OFF', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=260&fit=crop', grad: 'from-[#d07e20] to-[#a65d14]', bg: '#FFF4ED', border: '#e6c8a8', flash: true },
        { label: 'CAT FOOD', off: '25% OFF', img: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=400&h=260&fit=crop', grad: 'from-[#9C27B0] to-[#6A1B9A]', bg: '#F9F0FF', border: '#DDB6FF', flash: false },
        { label: 'GROOMING', off: '35% OFF', img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=260&fit=crop', grad: 'from-[#0F9B8E] to-[#007CF0]', bg: '#E0F7FA', border: '#80DEEA', flash: true },
        { label: 'DOG TREATS', off: '25% OFF', img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=260&fit=crop', grad: 'from-[#2196F3] to-[#0D47A1]', bg: '#EFF6FF', border: '#BFDBFE', flash: false },
        { label: 'CAT TREATS', off: '20% OFF', img: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=260&fit=crop', grad: 'from-[#4CAF50] to-[#1B5E20]', bg: '#F0FDF4', border: '#BBF7D0', flash: false },
        { label: 'ACCESSORIES', off: '40% OFF', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=260&fit=crop', grad: 'from-[#F44336] to-[#B71C1C]', bg: '#FFF1F2', border: '#FECACA', flash: true },
      ];
      for (const cat of DEFAULT_DEAL_CATEGORIES) {
        await prisma.dealCategory.create({ data: cat });
      }
      dealCategories = await prisma.dealCategory.findMany({ orderBy: { id: 'asc' } });
    }
    
    res.json(dealCategories);
  } catch (error) {
    console.error('Error fetching deal categories:', error);
    res.status(500).json({ error: 'Failed to fetch deal categories' });
  }
});

// POST new deal category
router.post('/', async (req, res) => {
  try {
    const { label, off, img, grad, bg, border, flash } = req.body;
    
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/deal_categories');

    const dealCategory = await prisma.dealCategory.create({
      data: {
        label: label || '',
        off: off || '',
        img: uploadedImg || '',
        grad: grad || 'from-[#d07e20] to-[#a65d14]',
        bg: bg || '#FFF4ED',
        border: border || '#e6c8a8',
        flash: flash === true || flash === 'true' || flash === 1 || flash === '1'
      }
    });
    
    res.status(201).json(dealCategory);
  } catch (error) {
    console.error('Error creating deal category:', error);
    res.status(500).json({ error: 'Failed to create deal category' });
  }
});

// PUT update deal category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, off, img, grad, bg, border, flash } = req.body;
    
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/deal_categories');

    const dealCategory = await prisma.dealCategory.update({
      where: { id: Number(id) },
      data: {
        label: label || '',
        off: off || '',
        img: uploadedImg || img || '',
        grad: grad || 'from-[#d07e20] to-[#a65d14]',
        bg: bg || '#FFF4ED',
        border: border || '#e6c8a8',
        flash: flash === true || flash === 'true' || flash === 1 || flash === '1'
      }
    });
    
    res.json(dealCategory);
  } catch (error) {
    console.error('Error updating deal category:', error);
    res.status(500).json({ error: 'Failed to update deal category' });
  }
});

// DELETE deal category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dealCategory.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal category:', error);
    res.status(500).json({ error: 'Failed to delete deal category' });
  }
});

module.exports = router;
