import "@root/loadEnv";
import request from "supertest";
import { createApp } from "@webapi/server";

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe("GET /api/articles/search", () => {
  let app: ReturnType<typeof createApp>;
  let accessToken: string;

  beforeAll(async () => {
    app = createApp();
    const name = unique("searchuser");
    const email = `${name}@example.com`;

    // Register and login
    await request(app)
      .post("/api/register")
      .send({ userName: name, email, password: "password123" });

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email, password: "password123" });

    accessToken = loginRes.body.result.accessToken;

    // Create multiple articles for search testing
    await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "JavaScript Tutorial", content: "Learn JavaScript basics" });

    await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Python Guide", content: "Introduction to Python" });

    await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "TypeScript Advanced", content: "Advanced TypeScript features" });
  });

  it("should return all articles without search query", async () => {
    const res = await request(app)
      .get("/api/articles/search");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.result.articles)).toBe(true);
    expect(res.body.result.articles.length).toBeGreaterThan(0);
    expect(res.body.result).toHaveProperty("total");
    expect(res.body.result).toHaveProperty("page");
    expect(res.body.result).toHaveProperty("limit");
  });

  it("should search articles by title", async () => {
    const res = await request(app)
      .get("/api/articles/search?q=JavaScript");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.result.articles)).toBe(true);
    
    const titles = res.body.result.articles.map((article: any) => article.title);
    expect(titles.some((title: string) => title.includes("JavaScript"))).toBe(true);
  });

  it("should search articles by content", async () => {
    const res = await request(app)
      .get("/api/articles/search?q=Python");

    expect(res.status).toBe(200);
    expect(res.body.result.articles.length).toBeGreaterThan(0);
  });

  it("should support pagination with page parameter", async () => {
    const res = await request(app)
      .get("/api/articles/search?page=1&limit=2");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.articles.length).toBeLessThanOrEqual(2);
    expect(res.body.result.page).toBe(1);
    expect(res.body.result.limit).toBe(2);
  });

  it("should support custom limit parameter", async () => {
    const res = await request(app)
      .get("/api/articles/search?limit=1");

    expect(res.status).toBe(200);
    expect(res.body.result.articles.length).toBeLessThanOrEqual(1);
    expect(res.body.result.limit).toBe(1);
  });

  it("should return empty array for non-existent search", async () => {
    const res = await request(app)
      .get("/api/articles/search?q=NonExistentArticle12345XYZ");

    expect(res.status).toBe(200);
    expect(res.body.result.articles.length).toBe(0);
  });

  it("should handle invalid page numbers gracefully", async () => {
    const res = await request(app)
      .get("/api/articles/search?page=-1");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should handle invalid limit values gracefully", async () => {
    const res = await request(app)
      .get("/api/articles/search?limit=0");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
