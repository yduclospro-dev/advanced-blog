import "@root/loadEnv";
import request from "supertest";
import { createApp } from "@webapi/server";

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe("GET /api/users", () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    app = createApp();

    for (let i = 1; i <= 3; i++) {
      const name = unique(`listuser${i}`);
      await request(app)
        .post("/api/register")
        .send({
          userName: name,
          email: `${name}@example.com`,
          password: "password123"
        });
    }
  });

  it("should return a list of users", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.result)).toBe(true);
    expect(res.body.result.length).toBeGreaterThan(0);
  });

  it("should return users with correct properties", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    const users = res.body.result;
    
    expect(users.length).toBeGreaterThan(0);
    
    const user = users[0];
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("userName");
    expect(user).toHaveProperty("email");
    expect(user).not.toHaveProperty("password"); // Should not expose password
  });

  it("should not require authentication", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
  });
});
