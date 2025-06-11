const orderService = require("../services/orderService");

// ✅ Sipariş oluştur
async function createOrder(req, res) {
  try {
    const userId = req.user.userId;
    // Kullanıcı profilini çek
    const user = await require("../services/userService").getProfile(userId);

    // Gerekli alanlar kontrolü
    if (!user.name || !user.email || !user.phone) {
      return res.status(400).json({
        error: "Sipariş için isim, e-posta ve telefon bilgileriniz eksiksiz olmalıdır."
      });
    }

    const result = await orderService.createOrder(userId);
    res.status(201).json(result);
  } catch (err) {
    console.error("createOrder error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kullanıcının tüm siparişlerini getir
async function getUserOrders(req, res) {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    console.error("getUserOrders error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

// ✅ Tek bir siparişi getir (kendi veya admin)
async function getOrderById(req, res) {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === "admin";
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId, userId, isAdmin);
    res.status(200).json(order);
  } catch (err) {
    console.error("getOrderById error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

// ✅ Admin: tüm siparişleri getir
async function getAllOrders(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Yetkisiz erişim" });
    }

    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error("getAllOrders error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

// ✅ Admin: sipariş durumunu güncelle
async function updateOrderStatus(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Yetkisiz erişim" });
    }

    const orderId = req.params.id;
    const { status } = req.body;
    const result = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(result);
  } catch (err) {
    console.error("updateOrderStatus error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kullanıcı veya admin: siparişi iptal et
async function cancelOrder(req, res) {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    const isAdmin = req.user.role === "admin";

    const result = await orderService.cancelOrder(orderId, userId, isAdmin);
    res.status(200).json(result);
  } catch (err) {
    console.error("cancelOrder error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
