const request = require('supertest');
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' })
    }
  }
}));
jest.mock('../utils/cloudinary', () => ({
  uploadToCloudinary: jest.fn().mockImplementation((img) => Promise.resolve(img))
}));
const app = require('../index');
const prisma = require('../db');

describe('Deal Categories API CRUD Tests', () => {
  beforeAll(async () => {
    await prisma.dealCategory.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should auto-seed default categories on GET /api/deal-categories when empty', async () => {
    const res = await request(app).get('/api/deal-categories');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(6);
    expect(res.body[0].label).toEqual('DOG FOOD');
  });

  it('should create a new deal category on POST /api/deal-categories', async () => {
    const payload = {
      label: 'TEST CATEGORY',
      off: '50% OFF',
      img: 'https://example.com/image.jpg',
      grad: 'from-blue-500 to-teal-500',
      bg: '#FFF',
      border: '#000',
      flash: true
    };

    const res = await request(app)
      .post('/api/deal-categories')
      .send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.label).toEqual('TEST CATEGORY');
    expect(res.body.off).toEqual('50% OFF');
    expect(res.body.flash).toEqual(true);
  });

  it('should update a deal category on PUT /api/deal-categories/:id', async () => {
    const categories = await prisma.dealCategory.findMany();
    const target = categories.find(c => c.label === 'TEST CATEGORY');
    
    const payload = {
      ...target,
      label: 'UPDATED TEST CATEGORY',
      flash: false
    };

    const res = await request(app)
      .put(`/api/deal-categories/${target.id}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.label).toEqual('UPDATED TEST CATEGORY');
    expect(res.body.flash).toEqual(false);
  });

  it('should delete a deal category on DELETE /api/deal-categories/:id', async () => {
    const categories = await prisma.dealCategory.findMany();
    const target = categories.find(c => c.label === 'UPDATED TEST CATEGORY');

    const res = await request(app).delete(`/api/deal-categories/${target.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);

    const check = await prisma.dealCategory.findUnique({ where: { id: target.id } });
    expect(check).toBeNull();
  });
});
