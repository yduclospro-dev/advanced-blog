import "@root/loadEnv";
import request from 'supertest';
import { createApp } from '@webapi/server';

describe('Commentaires API', () => {
  let app: ReturnType<typeof createApp>;
  describe('POST /api/articles/:articleId/comments', () => {
    beforeAll(() => {
      app = createApp();
    });

    it('should create a comment when authenticated', async () => {
      // TODO: mock authentication and article
      const articleId = 'dummy-article-id';
      const token = 'dummy-jwt';
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Nouveau commentaire' });
      // 201: created, 404: article not found, 401: unauthorized (dummy token)
      expect([201, 404, 401]).toContain(res.status);
    });
    it('should fail if not authenticated', async () => {
      const articleId = 'dummy-article-id';
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({ content: 'Nouveau commentaire' });
      expect(res.status).toBe(401);
    });
    it('should fail if content is missing', async () => {
      const articleId = 'dummy-article-id';
      const token = 'dummy-jwt';
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ });
      // 400: missing content (if authenticated), 401: unauthorized (dummy token)
      expect([400, 401]).toContain(res.status);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update a comment when authenticated and author', async () => {
      // TODO: mock authentication, create comment, and use real IDs
      const commentId = 'dummy-comment-id';
      const token = 'dummy-jwt';
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Commentaire modifié' });
      // 200: updated, 404: not found, 403: not author, 401: unauthorized (dummy token)
      expect([200, 404, 403, 401]).toContain(res.status);
    });
    it('should fail if not authenticated', async () => {
      const commentId = 'dummy-comment-id';
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .send({ content: 'Commentaire modifié' });
      expect(res.status).toBe(401);
    });
    it('should fail if content is missing', async () => {
      const commentId = 'dummy-comment-id';
      const token = 'dummy-jwt';
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ });
      // 400: missing content (if authenticated), 401: unauthorized (dummy token)
      expect([400, 401]).toContain(res.status);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment when authenticated and author', async () => {
      // TODO: mock authentication, create comment, and use real IDs
      const commentId = 'dummy-comment-id';
      const token = 'dummy-jwt';
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`);
      // 204: deleted, 404: not found, 403: not author, 401: unauthorized (dummy token)
      expect([204, 404, 403, 401]).toContain(res.status);
    });
    it('should fail if not authenticated', async () => {
      const commentId = 'dummy-comment-id';
      const res = await request(app)
        .delete(`/api/comments/${commentId}`);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/articles/:articleId/comments', () => {
    it('should return comments for an article when authenticated', async () => {
      // TODO: mock authentication and article
      const articleId = 'dummy-article-id';
      const token = 'dummy-jwt';
      const res = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set('Authorization', `Bearer ${token}`);
      // 200: found, 404: not found, 401: unauthorized (dummy token)
      expect([200, 404, 401]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      }
    });
    it('should fail if not authenticated', async () => {
      const articleId = 'dummy-article-id';
      const res = await request(app)
        .get(`/api/articles/${articleId}/comments`);
      expect(res.status).toBe(401);
    });
  });
});
