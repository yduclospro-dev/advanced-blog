import request from 'supertest';
import { app } from '@webapi/server';
import { redisClient } from '@infra/redisClient';

jest.mock('@infra/redisClient', () => {
  const redisClientMock = {
    get: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  // valeurs par défaut
  (redisClientMock.get as jest.Mock).mockResolvedValue(null);
  (redisClientMock.incr as jest.Mock).mockResolvedValue(1);

  return {
    __esModule: true,
    redisClient: redisClientMock,
  };
});

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

describe('POST /api/login', () => {
  const name = unique('loginuser');
  const email = `${name}@example.com`;

  beforeAll(async () => {
    // Sanity check : on vérifie que c’est BIEN un mock
    // (tu peux laisser ça le temps de débug)
    // @ts-ignore
    console.log('typeof redisClient.get =', typeof redisClient.get);
    // @ts-ignore
    console.log('isMock?', jest.isMockFunction(redisClient.get));

    await request(app)
      .post('/api/register')
      .send({ userName: name, email, password: 'password123' });
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('accessToken');
  });

  it('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  it('should fail with unknown email', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: unique('notfound') + '@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});
