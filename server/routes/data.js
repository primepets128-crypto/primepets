const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  try {
    const [slides, categories, deals, products, settings, banners, coupons] = await Promise.all([
      prisma.slide.findMany(),
      prisma.category.findMany(),
      prisma.deal.findMany(),
      prisma.product.findMany(),
      prisma.frontendSetting.findFirst(),
      prisma.banner.findMany(),
      prisma.coupon.findMany({ orderBy: { id: 'asc' } })
    ]);

    let dealCategories = await prisma.dealCategory.findMany({ orderBy: { id: 'asc' } });
    if (dealCategories.length === 0) {
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

    const parsedProducts = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json({
      slides,
      banners,
      categories,
      deals,
      products: parsedProducts,
      frontendSettings: settings,
      coupons,
      dealCategories
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data', 
      details: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
