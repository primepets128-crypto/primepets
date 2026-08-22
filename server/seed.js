const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

console.log("TURSO_DATABASE_URL is:", process.env.TURSO_DATABASE_URL);

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

const INITIAL_SLIDES = [
  {
    "id": 24,
    "gradient": "from-[#b96c1a] via-[#FF8C00] to-[#FFA500]",
    "tag": "🐾 Monsoon Special",
    "badge": "PAWDAY SALE IS BACK!",
    "title": "UP TO 30% OFF!",
    "subtitle": "Food, Treats, Toys & More",
    "cta": "SHOP NOW",
    "dog": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=420&fit=crop",
    "cat": "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=340&h=380&fit=crop",
    "heroImage": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1600"
  },
  {
    "id": 25,
    "gradient": "from-[#6C3FC8] via-[#8B5CF6] to-[#A78BFA]",
    "tag": "🌟 Limited Time",
    "badge": "MEGA SUMMER DEALS!",
    "title": "FLAT 40% OFF!",
    "subtitle": "Premium Cat & Dog Food",
    "cta": "EXPLORE DEALS",
    "dog": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=420&fit=crop",
    "cat": "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=340&h=380&fit=crop",
    "heroImage": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1600"
  },
  {
    "id": 26,
    "gradient": "from-[#0F9B8E] via-[#1DB9A3] to-[#2ED8BE]",
    "tag": "✨ Best Sellers",
    "badge": "NEW GROOMING RANGE",
    "title": "UP TO 35% OFF!",
    "subtitle": "Grooming, Spa & Accessories",
    "cta": "SHOP GROOMING",
    "dog": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=420&fit=crop",
    "cat": "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=340&h=380&fit=crop",
    "heroImage": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1600"
  }
];
const INITIAL_BANNERS = [
  {
    "id": 1,
    "mediaUrl": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200",
    "link": "/category"
  }
];
const INITIAL_CATEGORIES = [
  {
    "id": 61,
    "label": "Bone Broth",
    "emoji": "🍖",
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop",
    "bg": "#fdf7f1"
  },
  {
    "id": 62,
    "label": "Ice Creams",
    "emoji": "🍦",
    "img": "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=100&h=100&fit=crop",
    "bg": "#E3F2FD"
  },
  {
    "id": 63,
    "label": "Grooming",
    "emoji": "✂️",
    "img": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=100&h=100&fit=crop",
    "bg": "#E8F5E9"
  },
  {
    "id": 64,
    "label": "Dog Bowls",
    "emoji": "🥣",
    "img": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop",
    "bg": "#FFF8E1"
  },
  {
    "id": 65,
    "label": "Monsoon Wear",
    "emoji": "🌧️",
    "img": "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=100&h=100&fit=crop",
    "bg": "#E1F5FE"
  },
  {
    "id": 66,
    "label": "Cat Litter",
    "emoji": "🐱",
    "img": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop",
    "bg": "#F3E5F5"
  },
  {
    "id": 67,
    "label": "Cat Bowls",
    "emoji": "🍽️",
    "img": "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=100&h=100&fit=crop",
    "bg": "#FBE9E7"
  },
  {
    "id": 68,
    "label": "Nutrimeow",
    "emoji": "🌿",
    "img": "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=100&h=100&fit=crop",
    "bg": "#E8F5E9"
  },
  {
    "id": 69,
    "label": "Dog Toys",
    "emoji": "🎾",
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
    "bg": "#fdf7f1"
  },
  {
    "id": 70,
    "label": "Pet Beds",
    "emoji": "🛏️",
    "img": "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=100&h=100&fit=crop",
    "bg": "#E3F2FD"
  },
  {
    "id": 71,
    "label": "Leashes",
    "emoji": "🔗",
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
    "bg": "#FCE4EC"
  },
  {
    "id": 72,
    "label": "Health",
    "emoji": "💊",
    "img": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop",
    "bg": "#E8F5E9"
  }
];
const INITIAL_DEALS = [
  {
    "id": 41,
    "title": "UP TO 30% OFF",
    "sub": "DOG FOOD",
    "badge": "🐕 Dogs",
    "tag": "Bestseller",
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    "grad": "from-[#d07e20] to-[#a65d14]",
    "bg": "#FFF4ED",
    "border": "#e6c8a8",
    "save": "Save ₹450"
  },
  {
    "id": 42,
    "title": "UP TO 25% OFF",
    "sub": "CAT FOOD",
    "badge": "🐈 Cats",
    "tag": "Trending",
    "img": "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=400&h=300&fit=crop",
    "grad": "from-[#9C27B0] to-[#6A1B9A]",
    "bg": "#F9F0FF",
    "border": "#DDB6FF",
    "save": "Save ₹320"
  },
  {
    "id": 43,
    "title": "UP TO 25% OFF",
    "sub": "DOG TREATS",
    "badge": "🦴 Treats",
    "tag": "New",
    "img": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    "grad": "from-[#2196F3] to-[#0D47A1]",
    "bg": "#EFF6FF",
    "border": "#BFDBFE",
    "save": "Save ₹280"
  },
  {
    "id": 44,
    "title": "UP TO 25% OFF",
    "sub": "CAT TREATS",
    "badge": "🐾 Cats",
    "tag": "Popular",
    "img": "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=300&fit=crop",
    "grad": "from-[#4CAF50] to-[#1B5E20]",
    "bg": "#F0FDF4",
    "border": "#BBF7D0",
    "save": "Save ₹220"
  },
  {
    "id": 45,
    "title": "UP TO 40% OFF",
    "sub": "PET BEDS",
    "badge": "🛏️ Beds",
    "tag": "Winter",
    "img": "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=300&fit=crop",
    "grad": "from-[#E91E63] to-[#C2185B]",
    "bg": "#FCE4EC",
    "border": "#F48FB1",
    "save": "Save ₹500"
  },
  {
    "id": 46,
    "title": "BUY 1 GET 1",
    "sub": "GROOMING KIT",
    "badge": "✂️ Groom",
    "tag": "Special",
    "img": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=300&fit=crop",
    "grad": "from-[#00BCD4] to-[#0097A7]",
    "bg": "#E0F7FA",
    "border": "#80DEEA",
    "save": "Save ₹350"
  },
  {
    "id": 47,
    "title": "FLAT 20% OFF",
    "sub": "PET TOYS",
    "badge": "🎾 Toys",
    "tag": "Fun",
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    "grad": "from-[#FFC107] to-[#FFA000]",
    "bg": "#FFF8E1",
    "border": "#FFE082",
    "save": "Save ₹150"
  },
  {
    "id": 48,
    "title": "UP TO 15% OFF",
    "sub": "HEALTHCARE",
    "badge": "💊 Health",
    "tag": "Essential",
    "img": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
    "grad": "from-[#009688] to-[#00796B]",
    "bg": "#E0F2F1",
    "border": "#80CBC4",
    "save": "Save ₹200"
  }
];
const INITIAL_PRODUCTS = [
  {
    "id": 108,
    "name": "Royal Canin Adult Dog",
    "brand": "Royal Canin",
    "price": 1299,
    "mrp": 1599,
    "rating": 4.5,
    "reviews": 1243,
    "img": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
    "images": null,
    "tag": "19% OFF",
    "badge": "🏆 Bestseller",
    "category": "Dog Food",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 109,
    "name": "Whiskas Dry Cat Food",
    "brand": "Whiskas",
    "price": 549,
    "mrp": 699,
    "rating": 4.3,
    "reviews": 856,
    "img": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=300&fit=crop",
    "images": null,
    "tag": "21% OFF",
    "badge": "⭐ Top Rated",
    "category": "Cat Food",
    "petType": "Cats",
    "description": null
  },
  {
    "id": 110,
    "name": "Pedigree Pro Expert 3kg",
    "brand": "Pedigree",
    "price": 899,
    "mrp": 1099,
    "rating": 4.4,
    "reviews": 2104,
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
    "images": null,
    "tag": "18% OFF",
    "badge": "🔥 Hot Deal",
    "category": "Dog Food",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 111,
    "name": "Drools Chicken & Egg",
    "brand": "Drools",
    "price": 749,
    "mrp": 999,
    "rating": 4.2,
    "reviews": 643,
    "img": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",
    "images": null,
    "tag": "25% OFF",
    "badge": "✨ New",
    "category": "Dog Food",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 112,
    "name": "Farmina N&D Grain Free",
    "brand": "Farmina",
    "price": 2199,
    "mrp": 2799,
    "rating": 4.7,
    "reviews": 432,
    "img": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop",
    "images": null,
    "tag": "21% OFF",
    "badge": "💎 Premium",
    "category": "Dog Food",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 113,
    "name": "Hills Science Diet Cat",
    "brand": "Hills",
    "price": 1649,
    "mrp": 1999,
    "rating": 4.6,
    "reviews": 788,
    "img": "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=300&h=300&fit=crop",
    "images": null,
    "tag": "17% OFF",
    "badge": "🌟 Staff Pick",
    "category": "Cat Food",
    "petType": "Cats",
    "description": null
  },
  {
    "id": 114,
    "name": "Orijen Original Dog",
    "brand": "Orijen",
    "price": 3499,
    "mrp": 4199,
    "rating": 4.8,
    "reviews": 327,
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
    "images": null,
    "tag": "16% OFF",
    "badge": "👑 Premium",
    "category": "Dog Food",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 115,
    "name": "Purina Pro Plan Cat",
    "brand": "Purina",
    "price": 1199,
    "mrp": 1499,
    "rating": 4.5,
    "reviews": 951,
    "img": "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=300&h=300&fit=crop",
    "images": null,
    "tag": "20% OFF",
    "badge": "🎯 Popular",
    "category": "Cat Food",
    "petType": "Cats",
    "description": null
  },
  {
    "id": 116,
    "name": "Premium Pet Grooming Kit",
    "brand": "Pawsome",
    "price": 1499,
    "mrp": 1999,
    "rating": 4.6,
    "reviews": 342,
    "img": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop",
    "images": null,
    "tag": "25% OFF",
    "badge": "✨ New",
    "category": "Grooming",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 117,
    "name": "Interactive Squeaky Dog Toy",
    "brand": "Kong",
    "price": 499,
    "mrp": 699,
    "rating": 4.7,
    "reviews": 1892,
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
    "images": null,
    "tag": "28% OFF",
    "badge": "🔥 Hot Deal",
    "category": "Dog Toys",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 118,
    "name": "Plush Calming Pet Bed",
    "brand": "SleepyPaws",
    "price": 1899,
    "mrp": 2499,
    "rating": 4.9,
    "reviews": 876,
    "img": "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=300&h=300&fit=crop",
    "images": null,
    "tag": "24% OFF",
    "badge": "💎 Premium",
    "category": "Pet Beds",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 119,
    "name": "Multivitamin Pet Supplements",
    "brand": "PetHealth",
    "price": 699,
    "mrp": 899,
    "rating": 4.5,
    "reviews": 521,
    "img": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",
    "images": null,
    "tag": "22% OFF",
    "badge": "⭐ Top Rated",
    "category": "Health",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 120,
    "name": "Waterproof Dog Raincoat",
    "brand": "MonsoonPets",
    "price": 899,
    "mrp": 1199,
    "rating": 4.3,
    "reviews": 234,
    "img": "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=300&h=300&fit=crop",
    "images": null,
    "tag": "25% OFF",
    "badge": "🌧️ Seasonal",
    "category": "Monsoon Wear",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 121,
    "name": "Adjustable Dog Collar & Leash",
    "brand": "PawStyle",
    "price": 599,
    "mrp": 799,
    "rating": 4.4,
    "reviews": 654,
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
    "images": null,
    "tag": "25% OFF",
    "badge": "🎯 Popular",
    "category": "Leashes",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 122,
    "name": "Professional Spa Service (At Home)",
    "brand": "PrimePets Services",
    "price": 1999,
    "mrp": 2499,
    "rating": 4.8,
    "reviews": 120,
    "img": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop",
    "images": null,
    "tag": "Service",
    "badge": "✂️ Spa",
    "category": "Grooming",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 123,
    "name": "Nail Clipping & Ear Cleaning",
    "brand": "PrimePets Services",
    "price": 499,
    "mrp": 699,
    "rating": 4.5,
    "reviews": 85,
    "img": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop",
    "images": null,
    "tag": "Service",
    "badge": "✂️ Groom",
    "category": "Grooming",
    "petType": "Cats",
    "description": null
  },
  {
    "id": 124,
    "name": "Feather Teaser Cat Toy",
    "brand": "MeowMagic",
    "price": 299,
    "mrp": 399,
    "rating": 4.2,
    "reviews": 412,
    "img": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=300&fit=crop",
    "images": null,
    "tag": "25% OFF",
    "badge": "⭐ Top Rated",
    "category": "Dog Toys",
    "petType": "Cats",
    "description": null
  },
  {
    "id": 125,
    "name": "Orthopedic Memory Foam Bed",
    "brand": "SleepyPaws",
    "price": 3499,
    "mrp": 4999,
    "rating": 4.9,
    "reviews": 210,
    "img": "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=300&h=300&fit=crop",
    "images": null,
    "tag": "30% OFF",
    "badge": "💎 Premium",
    "category": "Pet Beds",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 126,
    "name": "Dental Care Chews",
    "brand": "PetHealth",
    "price": 399,
    "mrp": 499,
    "rating": 4.6,
    "reviews": 650,
    "img": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",
    "images": null,
    "tag": "20% OFF",
    "badge": "🩺 Health",
    "category": "Health",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 127,
    "name": "Reflective Monsoon Jacket",
    "brand": "MonsoonPets",
    "price": 1299,
    "mrp": 1599,
    "rating": 4.7,
    "reviews": 145,
    "img": "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=300&h=300&fit=crop",
    "images": null,
    "tag": "18% OFF",
    "badge": "🌧️ Seasonal",
    "category": "Monsoon Wear",
    "petType": "Dogs",
    "description": null
  },
  {
    "id": 128,
    "name": "Heavy Duty Rope Leash",
    "brand": "PawStyle",
    "price": 899,
    "mrp": 1099,
    "rating": 4.8,
    "reviews": 312,
    "img": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",
    "images": null,
    "tag": "18% OFF",
    "badge": "🔗 Strong",
    "category": "Leashes",
    "petType": "Dogs",
    "description": null
  }
];
const INITIAL_SETTINGS = {
  "id": 6,
  "storeName": "Prime Pets",
  "tagline": "Universe",
  "logoChar": "P",
  "footerDescription": "Welcome to the ultimate pet universe. The most premium, high-energy pet store in India. Caring for your pets since 2008.",
  "facebookUrl": "https://facebook.com",
  "instagramUrl": "https://instagram.com",
  "youtubeUrl": "https://youtube.com",
  "whatsappNumber": "+919876543210",
  "logoBase64": null,
  "facebookPixelId": "2059730591295871"
};

async function main() {
  console.log('Seeding database...');
  
  // Clear existing
  await prisma.slide.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.product.deleteMany();
  await prisma.frontendSetting.deleteMany();

  // Create
  for (const s of INITIAL_SLIDES) await prisma.slide.create({ data: s });
  for (const b of INITIAL_BANNERS) await prisma.banner.create({ data: b });
  for (const c of INITIAL_CATEGORIES) await prisma.category.create({ data: c });
  for (const d of INITIAL_DEALS) await prisma.deal.create({ data: d });
  for (const p of INITIAL_PRODUCTS) await prisma.product.create({ data: p });
  
  if (INITIAL_SETTINGS && Object.keys(INITIAL_SETTINGS).length > 0) {
    await prisma.frontendSetting.create({ data: INITIAL_SETTINGS });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
