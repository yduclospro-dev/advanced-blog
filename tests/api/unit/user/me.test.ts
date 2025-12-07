import "@root/loadEnv";
import request from 'supertest';
import { createApp } from '@webapi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe('GET /api/me', () => {
  let app: ReturnType<typeof createApp> = createApp();
  let accessToken: string;

  beforeAll(async () => {
    app = createApp();

    const name = unique('meuser');
    const email = `${name}@example.com`;
    await request(app)
      .post('/api/register')
      .send({ userName: name, email, password: 'password123' });
    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'password123' });
    accessToken = res.body.result.accessToken;
  });

  it('should return user info with valid token', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('email');
  });

  it('should fail without token', async () => {
    const res = await request(app)
      .get('/api/me');
    expect(res.status).toBe(401);
  });

  it('should fail with invalid token', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});
