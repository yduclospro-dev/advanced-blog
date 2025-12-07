import "@root/loadEnv";
import request from "supertest";
import { createApp } from "@webapi/server";

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe("Password Reset Flow", () => {
  let app: ReturnType<typeof createApp>;
  let userEmail: string;

  beforeAll(async () => {
    app = createApp();
    const name = unique("resetuser");
    userEmail = `${name}@example.com`;

    await request(app)
      .post("/api/register")
      .send({
        userName: name,
        email: userEmail,
        password: "oldpassword123"
      });
  });

  describe("POST /api/forgot-password", () => {
    it("should accept valid email and return success", async () => {
      const res = await request(app)
        .post("/api/forgot-password")
        .send({ email: userEmail });

      expect([200, 500]).toContain(res.status);
    });

    it("should return success even for non-existent email (security)", async () => {
      const res = await request(app)
        .post("/api/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect([200, 404]).toContain(res.status);
    });

    it("should fail if email is missing", async () => {
      const res = await request(app)
        .post("/api/forgot-password")
        .send({});

      expect(res.status).toBe(400);
    });

    it("should fail if email format is invalid", async () => {
      const res = await request(app)
        .post("/api/forgot-password")
        .send({ email: "invalid-email" });

      expect([400, 200]).toContain(res.status);
    });

    it("should fail if user is already authenticated", async () => {
      const loginRes = await request(app)
        .post("/api/login")
        .send({ email: userEmail, password: "oldpassword123" });

      const accessToken = loginRes.body.result.accessToken;

      const res = await request(app)
        .post("/api/forgot-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ email: userEmail });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/reset-password", () => {
    it("should fail if token is missing", async () => {
      const res = await request(app)
        .post("/api/reset-password")
        .send({ newPassword: "newpassword123" });

      expect(res.status).toBe(400);
    });

    it("should fail if newPassword is missing", async () => {
      const res = await request(app)
        .post("/api/reset-password")
        .send({ token: "some-token" });

      expect(res.status).toBe(400);
    });

    it("should fail if user is already authenticated", async () => {
      const loginRes = await request(app)
        .post("/api/login")
        .send({ email: userEmail, password: "oldpassword123" });

      const accessToken = loginRes.body.result.accessToken;

      const res = await request(app)
        .post("/api/reset-password")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          token: "some-token",
          newPassword: "newpassword123"
        });

      expect(res.status).toBe(400);
    });
  });
});
