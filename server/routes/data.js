const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  try {
    const slides = await prisma.slide.findMany();
    const categories = await prisma.category.findMany();
    const deals = await prisma.deal.findMany();
    const products = await prisma.product.findMany();
    const settings = await prisma.frontendSetting.findFirst();

    res.json({
      slides,
      categories,
      deals,
      products,
      frontendSettings: settings
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
