// __tests__/orderController.test.js
const request = require("supertest");
const app     = require("../index");

describe("Order Controller", () => {
  let token, orderId, productId;

  beforeAll(async () => {
    // 1) Giriş yap, token al
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "Password123" });
    token = login.body.token;

    // 2) Ürün oluştur ve sepete ekle
    const prod = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Siparişlik Ürün", description: "Test", price: 19.99 });
    productId = prod.body.id;

    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ product_id: productId, quantity: 1 });

    // 3) Sipariş oluştur
    const order = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`);
    orderId = order.body.id;
  });

  it("GET /api/orders/:id → 200, sipariş detayını döndürmeli", async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
  });

  it("PUT /api/orders/:id/status → 200, status güncellemeli", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "paid" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("paid");
  });
});
