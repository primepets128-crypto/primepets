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
      coupons
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
