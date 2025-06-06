// server/controllers/orderController.js
const supabase = require("../services/supabase");
const supabaseAdmin = require("../services/supabase").supabaseAdmin;
const { sendMail } = require("../services/emailService");

// Sipariş oluştur
async function createOrder(req, res) {
  const userId = Number(req.user.id);
  const userEmail = req.user.email;
  if (isNaN(userId)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  try {
    // items body'de varsa kullan, yoksa sepete bak
    let items = Array.isArray(req.body.items) && req.body.items.length
      ? req.body.items
      : (await supabase
          .from("cart")
          .select("product_id, quantity")
          .eq("user_id", userId)
        ).data;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Sipariş için en az bir ürün olmalı" });
    }

    // Ürün fiyatları
    const productIds = items.map(i => i.product_id);
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id, price")
      .in("id", productIds);
    if (prodErr) throw prodErr;

    // order_items nesnelerini oluştur
    const orderItems = items.map(i => ({
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: products.find(p => p.id === i.product_id)?.price || 0
    }));

    // Toplam hesapla
    const total_amount = orderItems.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);

    // orders tablosuna insert
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert([{ user_id: userId, total_amount, status: "pending" }])
      .select()
      .single();
    if (orderErr) throw orderErr;

    // order_items tablosuna insert
    await supabaseAdmin
      .from("order_items")
      .insert(orderItems.map(it => ({ order_id: order.id, ...it })));

    // Stok güncelle
    await Promise.all(
      items.map(async it => {
        const { data: current } = await supabase
          .from("crud")
          .select("stock")
          .eq("id", it.product_id)
          .single();
        return supabaseAdmin
          .from("crud")
          .update({ stock: current.stock - it.quantity })
          .eq("id", it.product_id);
      })
    );

    // Sepeti temizle
    await supabaseAdmin
      .from("cart")
      .delete()
      .eq("user_id", userId);

    // E-posta bildirimi
    sendMail({
      to: userEmail,
      subject: "Siparişiniz Alındı",
      text: `Siparişiniz (ID: ${order.id}) başarıyla alındı.`,
      html: `<p>Sipariş ID: <strong>${order.id}</strong><br/>Toplam: ${total_amount} TL</p>`
    }).catch(err => console.error("E-posta gönderilemedi:", err));

    return res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Kullanıcının siparişlerini sayfalı getir
async function getMyOrders(req, res) {
  const userId = Number(req.user.id);
  if (isNaN(userId)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("orders")
      .select(`id, total_amount, status, created_at, order_items(*)`, { count: "exact" })
      .eq("user_id", userId);

    if (status) query = query.eq("status", status);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    return res.status(200).json({ page, limit, total: count, data });
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Sipariş detayı getir
async function getOrderById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Geçersiz sipariş ID" });
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`id, user_id, order_items(*), total_amount, status, created_at`)
      .eq("id", id)
      .single();
    if (error) return res.status(404).json({ error: "Sipariş bulunamadı" });
    return res.status(200).json(data);
  } catch (err) {
    console.error("getOrderById error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Admin veya kullanıcı: sipariş durum güncelle
async function updateOrderStatus(req, res) {
  const orderId = Number(req.params.id);
  const { status } = req.body;
  if (isNaN(orderId) || typeof status !== "string") {
    return res.status(400).json({ error: "Geçersiz parametre" });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();
    if (error) return res.status(404).json({ error: "Güncelleme başarısız" });
    return res.status(200).json(data);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// İptal et ve stok iade et
async function cancelOrder(req, res) {
  const orderId = Number(req.params.id);
  const userId = Number(req.user.id);
  const isAdmin = req.user.role === "admin";

  if (isNaN(userId)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  try {
    const { data: order, error: ordErr } = await supabase
      .from("orders")
      .select("user_id, status")
      .eq("id", orderId)
      .single();
    if (ordErr || !order) return res.status(404).json({ error: "Sipariş bulunamadı" });
    if (!isAdmin && order.user_id !== userId) return res.status(403).json({ error: "Yetkiniz yok" });
    if (!["pending", "paid"].includes(order.status)) {
      return res.status(400).json({ error: `İptal uygun değil: ${order.status}` });
    }

    const { data: cancelled, error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .select()
      .single();
    if (updErr) throw updErr;

    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    await Promise.all(
      items.map(async it => {
        const { data: prod } = await supabase
          .from("crud")
          .select("stock")
          .eq("id", it.product_id)
          .single();
        return supabaseAdmin
          .from("crud")
          .update({ stock: prod.stock + it.quantity })
          .eq("id", it.product_id);
      })
    );

    return res.status(200).json({ message: "İptal edildi", order: cancelled });
  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};


// server/routes/orders.js
const express      = require("express");
const router       = express.Router();
const verifyToken  = require("../middleware/verifyToken");
const checkAdmin   = require("../middleware/checkAdmin");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/orderController");

// Hepsi token doğrulama gerektirir
router.use(verifyToken);

// POST   /api/orders           → Sepetten veya body’den sipariş oluştur
router.post("/", createOrder);

// GET    /api/orders           → Kendi siparişlerini listele
router.get("/", getMyOrders);

// GET    /api/orders/all       → Admin: tüm siparişleri listele
router.get("/all", checkAdmin, getAllOrders);

// GET    /api/orders/:id       → Sipariş detayını döndür
router.get("/:id", getOrderById);

// PUT    /api/orders/:id/status  → Admin: sipariş durumunu güncelle
router.put("/:id/status", checkAdmin, updateOrderStatus);

// PATCH  /api/orders/:id/cancel  → Kullanıcı veya Admin siparişi iptal etsin
router.patch("/:id/cancel", cancelOrder);

module.exports = router;