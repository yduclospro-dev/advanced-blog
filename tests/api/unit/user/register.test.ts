import request from 'supertest';
import { app } from '@webapi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const name = unique('register1');
    const res = await request(app)
      .post('/api/register')
      .send({ userName: name, email: `${name}@example.com`, password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should fail if email already exists', async () => {
    const name = unique('register2');
    await request(app)
      .post('/api/register')
      .send({ userName: name, email: `${name}@example.com`, password: 'password123' });
    const res = await request(app)
      .post('/api/register')
      .send({ userName: unique('register3'), email: `${name}@example.com`, password: 'password123' });
    expect(res.status).toBe(409);
  });

  it('should fail if userName already exists', async () => {
    const name = unique('register4');
    await request(app)
      .post('/api/register')
      .send({ userName: name, email: `${name}@example.com`, password: 'password123' });
    const res = await request(app)
      .post('/api/register')
      .send({ userName: name, email: unique('register5') + '@example.com', password: 'password123' });
    expect(res.status).toBe(409);
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'missing@example.com' });
    expect(res.status).toBe(400);
  });
});
