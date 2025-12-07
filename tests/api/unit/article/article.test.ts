import request from "supertest";
import { app } from "../../../globalApp";

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe("Articles API", () => {
  let accessToken: string;
  let articleId: string;

  beforeAll(async () => {
    const name = unique("articleuser");
    const email = `${name}@example.com`;

    await request(app)
      .post("/api/register")
      .send({ userName: name, email, password: "password123" });

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email, password: "password123" });

    accessToken = loginRes.body.result.accessToken;

    console.log("Obtained access token:", accessToken);

    const articleRes = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Test Article", content: "Test content" });

      console.log("Created article response:", articleRes.body);

    articleId = articleRes.body.result.id;
  });

  it("should get the created article", async () => {
    const res = await request(app).get(`/api/articles/${articleId}`);
    expect(res.status).toBe(200);
    expect(res.body.result.title).toBe("Test Article");
  });

  it("should update the article", async () => {
    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Updated Title", content: "Updated content" });

    expect(res.status).toBe(200);
    expect(res.body.result.title).toBe("Updated Title");
  });

  it("should delete the article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect([200, 204]).toContain(res.status);
  });
});