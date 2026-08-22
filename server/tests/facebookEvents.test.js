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

describe('Facebook Events API Integration Tests', () => {
  beforeAll(async () => {
    // Clean up test database records
    await prisma.facebookEvent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should successfully log a Facebook event on POST /api/analytics/facebook-event', async () => {
    const payload = {
      eventName: 'AddToCart',
      eventData: {
        content_name: 'Puppy Dog Food',
        value: 1200,
        currency: 'INR'
      },
      userEmail: 'customer@primepets.com',
      visitorId: 'vid_test123',
      url: 'http://localhost:5173/products/1',
      eventId: 'evt_test_123'
    };

    const res = await request(app)
      .post('/api/analytics/facebook-event')
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.event).toHaveProperty('id');
    expect(res.body.event.eventName).toEqual('AddToCart');
    expect(res.body.event.userEmail).toEqual('customer@primepets.com');
    expect(res.body.event.eventId).toEqual('evt_test_123');
  });

  it('should successfully retrieve logs and analytics stats on GET /api/analytics/facebook-events', async () => {
    const res = await request(app)
      .get('/api/analytics/facebook-events?range=7d');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('events');
    expect(res.body).toHaveProperty('chartData');
    expect(res.body).toHaveProperty('counts');
    expect(res.body).toHaveProperty('configStatus');

    expect(res.body.events).toBeInstanceOf(Array);
    expect(res.body.events.length).toBeGreaterThanOrEqual(1);
    expect(res.body.counts.AddToCart).toEqual(1);
  });
});
