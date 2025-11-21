import request from 'supertest';
import { app } from '../../../../WebApi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe('Articles API', () => {
  let accessToken: string;
  let articleId: string;

  beforeAll(async () => {
    // Register and login a user
    const name = unique('articleuser');
    const email = `${name}@example.com`;
    await request(app)
      .post('/api/register')
      .send({ userName: name, email, password: 'password123' });
    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'password123' });
    accessToken = res.body.result.accessToken;
  });

  it('should create an article', async () => {
    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Test Article', content: 'Test content' });
    expect(res.status).toBe(201);
    expect(res.body.result).toHaveProperty('id');
    articleId = res.body.result.id;
  });

  it('should get the created article', async () => {
    const res = await request(app)
      .get(`/api/articles/${articleId}`);
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('title', 'Test Article');
  });

  it('should update the article', async () => {
    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated Title', content: 'Updated content' });
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('title', 'Updated Title');
  });

  it('should delete the article', async () => {
    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 204]).toContain(res.status);
  });
});
