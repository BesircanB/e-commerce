// __tests__/cartController.test.js
const request = require("supertest");
const app     = require("../index");

describe("Cart Controller", () => {
  let token, productId;

  beforeAll(async () => {
    // 1) Giriş yap, token al
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "Password123" });
    token = login.body.token;

    // 2) Test ürünü oluştur, ID'sini sakla
    const prod = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Ürün", description: "Test", price: 9.99 });
    productId = prod.body.id;
  });

  it("POST /api/cart → 201, ürünü sepete eklemeli", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ product_id: productId, quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user_id");
    expect(res.body.product_id).toBe(productId);
    expect(res.body.quantity).toBe(2);
  });

  it("GET /api/cart → 200, sepeti getirmeli", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
