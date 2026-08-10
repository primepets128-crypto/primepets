const cloudinary = require('cloudinary').v2;
const prisma = require('./db.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadAndCreate() {
  try {
    console.log("Uploading slide1...");
    const res1 = await cloudinary.uploader.upload('C:\\Users\\HP\\.gemini\\antigravity\\brain\\77298526-46a3-41b2-9e90-610799d0e490\\scratch\\slide1.png', { folder: 'primepets/slides' });
    
    console.log("Uploading slide2...");
    const res2 = await cloudinary.uploader.upload('C:\\Users\\HP\\.gemini\\antigravity\\brain\\77298526-46a3-41b2-9e90-610799d0e490\\scratch\\slide2.png', { folder: 'primepets/slides' });

    console.log("Creating slides in DB...");
    await prisma.slide.create({
      data: {
        gradient: 'from-[#1a0e05] to-[#2a1608]',
        tag: 'RUN FREE',
        badge: 'Happy Pets',
        title: 'Joy In Every Step',
        subtitle: 'Let them explore the world with our premium gear.',
        cta: 'Explore Gear',
        dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
        cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
        heroImage: res1.secure_url
      }
    });

    await prisma.slide.create({
      data: {
        gradient: 'from-[#004d00] to-[#003300]',
        tag: 'ACCESSORIES',
        badge: 'Premium Quality',
        title: 'Prime Pets Accessories',
        subtitle: 'Stylish. Durable. Comfortable. Everything your pet deserves!',
        cta: 'Shop Accessories',
        dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
        cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
        heroImage: res2.secure_url
      }
    });

    console.log("Successfully created slides!");
  } catch (err) {
    console.error("Error:", err);
  }
}

uploadAndCreate();
