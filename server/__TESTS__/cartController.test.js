// __tests__/cartController.test.js
const request = require("supertest");
const app = require("../index");

let token;
let productId;
const email = `test_cart_${Date.now()}@example.com`;
const password = "CartPass123";

beforeAll(async () => {
  // Register
  await request(app)
    .post("/api/auth/register")
    .send({ email, password });

  // Login and get token
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  token = loginRes.body.token;

  // Ürün oluştur (stok kontrolü olan testler için gerekebilir)
  const productRes = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test Ürün",
      description: "Açıklama",
      price: 99.99,
      image_url: "https://via.placeholder.com/150",
      stock: 50
    });
  productId = productRes.body.id;
});

describe("Cart Controller", () => {
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
