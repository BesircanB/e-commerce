// __TESTS__/authController.test.js
const request = require("supertest");
const app     = require("../index");

describe("Auth Controller", () => {
  let token;
  const testEmail = "testuser_1748698669315@example.com"; // Dinamik üretildi
  const password = "Password123";

  it("POST /api/auth/register → 201, yeni bir kullanıcı oluşturmalı", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: testEmail, password });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
  });

  it("POST /api/auth/login → 200, geçerli token dönmeli", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("GET /api/users → 200, verifyToken ile kullanıcı listesini almalı", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
