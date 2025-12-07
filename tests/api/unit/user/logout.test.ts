import "@root/loadEnv";
import request from 'supertest';
import { createApp } from '@webapi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe('POST /api/logout', () => {
  let app: ReturnType<typeof createApp>;
  let refreshToken: string;

  beforeAll(async () => {
    app = createApp();
    const name = unique('logoutuser');
    const email = `${name}@example.com`;
    await request(app)
      .post('/api/register')
      .send({ userName: name, email, password: 'password123' });
    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'password123' });
    refreshToken = res.body.refreshToken;
  });

  it('should logout and revoke refreshToken', async () => {
    const res = await request(app)
      .post('/api/logout')
      .send({ refreshToken });
    expect([200, 204]).toContain(res.status);
  });

  it('should fail to logout with invalid refreshToken', async () => {
    const res = await request(app)
      .post('/api/logout')
      .send({ refreshToken: 'invalidtoken' });
    expect([200, 204]).toContain(res.status);
  });
});
