const prisma = require('./db.js');

async function main() {
  const count = await prisma.slide.count();
  if (count === 0) {
    await prisma.slide.create({
      data: {
        gradient: 'from-[#d07e20] to-[#E06900]',
        tag: 'NEW ARRIVALS',
        badge: 'Premium Pet Care',
        title: 'Everything Your Pet Needs',
        subtitle: 'Shop the best food, toys, and accessories for your furry friends.',
        cta: 'Shop Now',
        dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
        cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800'
      }
    });
    console.log("Seeded default slide to Turso.");
  } else {
    console.log("Slides already exist in Turso.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => process.exit(0));
