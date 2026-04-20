const jwt = require('jsonwebtoken');
const { secret } = require('../src/config/jwt');

jest.mock('../src/config/prisma', () => ({
  user: { create: jest.fn(), findUnique: jest.fn() },
  property: { 
    create: jest.fn(), 
    findMany: jest.fn(), 
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  favorite: { create: jest.fn(), delete: jest.fn(), findMany: jest.fn() },
  $executeRaw: jest.fn(),
  $queryRaw: jest.fn()
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

describe('API Integration', () => {
  const userToken = jwt.sign({ id: 'u1', role: 'USER' }, secret);
  const adminToken = jwt.sign({ id: 'a1', role: 'ADMIN' }, secret);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user', async () => {
    prisma.user.create.mockResolvedValue({ id: 'u1', email: 'a@a.com' });
    const res = await request(app).post('/auth/register').send({ email: 'a@a.com', password: 'pw' });
    expect(res.statusCode).toBe(201);
  });

  it('should create property (USER)', async () => {
    prisma.property.create.mockResolvedValue({ id: 'p1' });
    const res = await request(app)
      .post('/properties')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'T1', lat: 10, lng: 10 });
    expect(res.statusCode).toBe(201);
  });

  it('should get public list', async () => {
    prisma.$queryRaw.mockResolvedValue([{ id: 'p1', title: 'T1' }]);
    const res = await request(app).get('/properties');
    expect(res.statusCode).toBe(200);
  });

  it('should get nearby properties', async () => {
    prisma.$queryRaw.mockResolvedValue([]);
    const res = await request(app).get('/properties/nearby?lat=10&lng=10');
    expect(res.statusCode).toBe(200);
  });

  it('should allow admin to approve', async () => {
    prisma.property.update.mockResolvedValue({ id: 'p1' });
    const res = await request(app)
      .put('/properties/p1/approve')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should add to favorites', async () => {
    prisma.favorite.create.mockResolvedValue({ id: 'f1' });
    const res = await request(app)
      .post('/favorites/p1')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(201);
  });

  it('should get favorites', async () => {
    prisma.favorite.findMany.mockResolvedValue([{ id: 'f1', property: {} }]);
    const res = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });
});
