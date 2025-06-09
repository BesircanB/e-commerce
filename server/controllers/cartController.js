const cartService = require("../services/cartService");

// ✅ Ürün sepete ekle
async function addToCart(req, res) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const result = await cartService.addToCart({ userId, productId, quantity });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Sepetteki ürün miktarını güncelle
async function updateCartItem(req, res) {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;
    const { quantity } = req.body;
    const result = await cartService.updateCartItem({ userId, productId, quantity });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Ürünü sepetten kaldır
async function deleteCartItem(req, res) {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;
    const result = await cartService.removeFromCart({ userId, productId });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Sepeti tamamen temizle
async function clearCart(req, res) {
  try {
    const userId = req.user.userId;
    const result = await cartService.clearCart(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kullanıcının sepetini getir
async function getCart(req, res) {
  try {
    const userId = req.user.userId;
    const result = await cartService.getCart(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kuponu uygula
async function applyCouponToCart(req, res) {
  try {
    const userId = req.user.userId;
    const { couponCode } = req.body;
    const result = await cartService.applyCouponToCart({ userId, couponCode });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  getCart,
  applyCouponToCart,
};
