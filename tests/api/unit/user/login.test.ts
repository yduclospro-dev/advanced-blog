import "@root/loadEnv";
import request from 'supertest';
import { createApp } from '@webapi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

describe('POST /api/login', () => {
  let app: ReturnType<typeof createApp>;
  const name = unique('loginuser');
  const email = `${name}@example.com`;

  beforeAll(async () => {
    app = createApp();

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
