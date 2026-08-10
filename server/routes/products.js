const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    // Parse the JSON string of images back to an array for the frontend
    const parsedProducts = products.map(p => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : []
    }));
    res.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const { name, brand, price, mrp, rating, reviews, img, images, tag, badge, category, petType, description } = req.body;
    
    // Upload main image to Cloudinary if it's base64
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/products');
    
    // Upload additional images
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
        for (const image of images) {
            const up = await uploadToCloudinary(image, 'prime_pets/products');
            if (up) uploadedImages.push(up);
        }
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand: brand || '',
        price: Number(price),
        mrp: Number(mrp),
        rating: Number(rating) || 4.5,
        reviews: Number(reviews) || 0,
        img: uploadedImg || '',
        images: JSON.stringify(uploadedImages),
        tag,
        badge,
        category: category || '',
        petType: petType || 'Dogs',
        description
      }
    });
    
    // Return parsed version
    res.status(201).json({ ...product, images: uploadedImages });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, mrp, rating, reviews, img, images, tag, badge, category, petType, description } = req.body;
    
    // Upload main image if it's base64 (newly uploaded)
    const uploadedImg = await uploadToCloudinary(img, 'prime_pets/products');
    
    // Upload additional images if any are base64
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
        for (const image of images) {
            const up = await uploadToCloudinary(image, 'prime_pets/products');
            if (up) uploadedImages.push(up);
        }
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        brand: brand || '',
        price: Number(price),
        mrp: Number(mrp),
        rating: Number(rating) || 4.5,
        reviews: Number(reviews) || 0,
        img: uploadedImg || '',
        images: JSON.stringify(uploadedImages),
        tag,
        badge,
        category: category || '',
        petType: petType || 'Dogs',
        description
      }
    });
    
    res.json({ ...product, images: uploadedImages });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
