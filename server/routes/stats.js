const express = require('express');
const router = express.Router();
const prisma = require('../db');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (just in case it wasn't configured globally)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/', async (req, res) => {
  try {
    const [userCount, productCount, categoryCount, dealCount, bannerCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.deal.count(),
      prisma.banner.count(),
      prisma.order.count()
    ]);

    let cloudinaryStats = null;
    try {
      // Cloudinary usage API gives storage, bandwidth, and resources count
      const usage = await cloudinary.api.usage();
      cloudinaryStats = {
        storageUsage: usage.storage?.usage || 0, // In bytes
        bandwidthUsage: usage.bandwidth?.usage || 0, // In bytes
        mediaCount: usage.objects?.usage || 0,
        plan: usage.plan || 'Free'
      };
    } catch (cError) {
      console.warn("Cloudinary usage API failed (might need Admin API enabled):", cError.message);
      // Fallback
      cloudinaryStats = {
        storageUsage: 0,
        bandwidthUsage: 0,
        mediaCount: 0,
        plan: 'Unknown'
      };
    }

    res.json({
      database: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        deals: dealCount,
        banners: bannerCount,
        orders: orderCount
      },
      cloudinary: cloudinaryStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
