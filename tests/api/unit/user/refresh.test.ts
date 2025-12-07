import "@root/loadEnv";
import request from 'supertest';
import { createApp } from '@webapi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}
  
describe('POST /api/refresh', () => {
  let app: ReturnType<typeof createApp>;
  let refreshToken: string;

  beforeAll(async () => {
    app = createApp();
    const name = unique('refreshuser');
    const email = `${name}@example.com`;

    await request(app)
      .post('/api/register')
      .send({ userName: name, email, password: 'password123' });
    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'password123' });
    refreshToken = res.body.result.refreshToken;
  });

  it('should refresh token with valid refreshToken', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', `refresh_token=${refreshToken}`);
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('accessToken');
    expect(res.body.result).toHaveProperty('refreshToken');
  });

  it('should fail with invalid refreshToken', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', 'refresh_token=invalidtoken');
    expect(res.status).toBe(401);
  });
});
