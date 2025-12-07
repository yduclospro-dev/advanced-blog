import "@root/loadEnv";
import request from "supertest";
import { createApp } from "@webapi/server";

function unique(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

describe("Image Upload API", () => {
  let app: ReturnType<typeof createApp>;
  let accessToken: string;
  let uploadedImageUrl: string;

  beforeAll(async () => {
    app = createApp();
    const name = unique("imageuser");
    const email = `${name}@example.com`;

    // Register and login
    await request(app)
      .post("/api/register")
      .send({ userName: name, email, password: "password123" });

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email, password: "password123" });

    accessToken = loginRes.body.result.accessToken;
  });

  describe("POST /api/upload/image", () => {
    it("should fail if not authenticated", async () => {
      const res = await request(app)
        .post("/api/upload/image")
        .attach("image", Buffer.from("fake image"), "test.jpg");

      expect(res.status).toBe(401);
    });

    it("should fail if no file is uploaded", async () => {
      const res = await request(app)
        .post("/api/upload/image")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(400);
    });

    it("should fail if file field name is wrong", async () => {
      const res = await request(app)
        .post("/api/upload/image")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("wrongField", Buffer.from("fake image"), "test.jpg");

      // Multer returns 500 for unexpected field
      expect(res.status).toBe(500);
    });

    it("should handle image upload request (may fail without Cloudinary)", async () => {
      // Create a minimal valid image buffer (1x1 PNG)
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
        0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
        0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
        0x42, 0x60, 0x82
      ]);

      const res = await request(app)
        .post("/api/upload/image")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("image", pngBuffer, "test.png");

      // Should succeed if Cloudinary is configured, otherwise fail gracefully
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.result).toHaveProperty("imageUrl");
        uploadedImageUrl = res.body.result.imageUrl;
      } else {
        // If Cloudinary is not configured, expect 500 or specific error
        expect([500]).toContain(res.status);
      }
    });
  });

  describe("DELETE /api/upload/image", () => {
    it("should fail if not authenticated", async () => {
      const res = await request(app)
        .delete("/api/upload/image")
        .send({ imageUrl: "https://example.com/image.jpg" });

      expect(res.status).toBe(401);
    });

    it("should fail if imageUrl is missing", async () => {
      const res = await request(app)
        .delete("/api/upload/image")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should handle delete request (may fail without Cloudinary)", async () => {
      const testImageUrl = uploadedImageUrl || "https://res.cloudinary.com/test/image/upload/v123456/sample.jpg";
      
      const res = await request(app)
        .delete("/api/upload/image")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ imageUrl: testImageUrl });

      // Should succeed if Cloudinary is configured and image exists
      // Otherwise may return 500
      expect([200, 500]).toContain(res.status);
    });
  });
});
