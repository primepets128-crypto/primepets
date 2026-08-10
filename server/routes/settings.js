const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET settings (normally fetched via /api/data, but useful directly)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.frontendSetting.findFirst();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings
router.put('/', async (req, res) => {
  try {
    const { storeName, tagline, logoChar, footerDescription, facebookUrl, instagramUrl, youtubeUrl, whatsappNumber, logoBase64 } = req.body;
    
    // Upload logo to Cloudinary if it's new (base64)
    const uploadedLogo = await uploadToCloudinary(logoBase64, 'prime_pets/settings');

    let settings = await prisma.frontendSetting.findFirst();

    if (settings) {
        settings = await prisma.frontendSetting.update({
            where: { id: settings.id },
            data: {
                storeName: storeName || '',
                tagline: tagline || '',
                logoChar: logoChar || '',
                footerDescription: footerDescription || '',
                facebookUrl: facebookUrl || '',
                instagramUrl: instagramUrl || '',
                youtubeUrl: youtubeUrl || '',
                whatsappNumber: whatsappNumber || '',
                logoBase64: uploadedLogo || settings.logoBase64
            }
        });
    } else {
        settings = await prisma.frontendSetting.create({
            data: {
                storeName: storeName || '',
                tagline: tagline || '',
                logoChar: logoChar || '',
                footerDescription: footerDescription || '',
                facebookUrl: facebookUrl || '',
                instagramUrl: instagramUrl || '',
                youtubeUrl: youtubeUrl || '',
                whatsappNumber: whatsappNumber || '',
                logoBase64: uploadedLogo || ''
            }
        });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
