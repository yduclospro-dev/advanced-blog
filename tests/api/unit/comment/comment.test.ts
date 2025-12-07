import "@root/loadEnv";
import request from 'supertest';
import { createApp } from '@webapi/server';

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe('Comments API', () => {
  let app: ReturnType<typeof createApp>;
  let accessToken: string;
  let articleId: string;
  let commentId: string;

  beforeAll(async () => {
    app = createApp();
    const name = unique("commentuser");
    const email = `${name}@example.com`;

    await request(app)
      .post('/api/register')
      .send({ userName: name, email, password: 'password123' });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email, password: 'password123' });

    accessToken = loginRes.body.result.accessToken;

    const articleRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Test Article for Comments', content: 'Test content' });

    articleId = articleRes.body.result.id;
  });

  describe('POST /api/articles/:articleId/comments', () => {
    it('should create a comment when authenticated', async () => {
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'This is a test comment' });

      expect(res.status).toBe(201);
      expect(res.body.result).toHaveProperty('id');
      expect(res.body.result.content).toBe('This is a test comment');
      
      commentId = res.body.result.id;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({ content: 'Nouveau commentaire' });
      
      expect(res.status).toBe(401);
    });

    it('should fail if content is missing', async () => {
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should fail if article does not exist', async () => {
      const res = await request(app)
        .post('/api/articles/non-existent-id/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Comment on non-existent article' });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/articles/:articleId/comments', () => {
    it('should return comments for an article when authenticated', async () => {
      const res = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result.length).toBeGreaterThan(0);
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .get(`/api/articles/${articleId}/comments`);
      
      expect(res.status).toBe(401);
    });

    it('should fail if article does not exist', async () => {
      const res = await request(app)
        .get('/api/articles/non-existent-id/comments')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update a comment when authenticated and author', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Updated comment content' });

      expect(res.status).toBe(200);
      expect(res.body.result.content).toBe('Updated comment content');
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .send({ content: 'Commentaire modifié' });
      
      expect(res.status).toBe(401);
    });

    it('should fail if content is missing', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should fail if comment does not exist', async () => {
      const res = await request(app)
        .put('/api/comments/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Update non-existent comment' });

      expect(res.status).toBe(404);
    });

    it('should fail if user is not the author', async () => {
      const name2 = unique('commentuser2');
      const email2 = `${name2}@example.com`;
      
      await request(app)
        .post('/api/register')
        .send({ userName: name2, email: email2, password: 'password123' });

      const loginRes2 = await request(app)
        .post('/api/login')
        .send({ email: email2, password: 'password123' });

      const otherUserToken = loginRes2.body.result.accessToken;

      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ content: 'Trying to update someone else comment' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should fail if user is not the author', async () => {
      const name3 = unique('commentuser3');
      const email3 = `${name3}@example.com`;
      
      await request(app)
        .post('/api/register')
        .send({ userName: name3, email: email3, password: 'password123' });

      const loginRes3 = await request(app)
        .post('/api/login')
        .send({ email: email3, password: 'password123' });

      const otherUserToken = loginRes3.body.result.accessToken;

      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`);
      
      expect(res.status).toBe(401);
    });

    it('should delete a comment when authenticated and author', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect([200, 204]).toContain(res.status);
    });

    it('should fail if comment does not exist', async () => {
      const res = await request(app)
        .delete('/api/comments/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });
});
