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
    const {
      storeName, tagline, logoChar, footerDescription,
      facebookUrl, instagramUrl, youtubeUrl, whatsappNumber,
      logoBase64, razorpayKeyId, whatsappOrderNumber,
      siteAudioUrl, contactEmail, contactPhone
    } = req.body;
    
    // Upload logo to Cloudinary if it's new (base64)
    const uploadedLogo = await uploadToCloudinary(logoBase64, 'prime_pets/settings');

    let settings = await prisma.frontendSetting.findFirst();

    const data = {
      storeName: storeName || '',
      tagline: tagline || '',
      logoChar: logoChar || '',
      footerDescription: footerDescription || '',
      facebookUrl: facebookUrl || '',
      instagramUrl: instagramUrl || '',
      youtubeUrl: youtubeUrl || '',
      whatsappNumber: whatsappNumber || '',
      razorpayKeyId: razorpayKeyId !== undefined ? razorpayKeyId : null,
      whatsappOrderNumber: whatsappOrderNumber !== undefined ? whatsappOrderNumber : null,
      siteAudioUrl: siteAudioUrl !== undefined ? siteAudioUrl : null,
      contactEmail: contactEmail !== undefined ? contactEmail : null,
      contactPhone: contactPhone !== undefined ? contactPhone : null,
    };

    if (settings) {
      data.logoBase64 = uploadedLogo || settings.logoBase64;
      settings = await prisma.frontendSetting.update({
        where: { id: settings.id },
        data
      });
    } else {
      data.logoBase64 = uploadedLogo || '';
      settings = await prisma.frontendSetting.create({ data });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
