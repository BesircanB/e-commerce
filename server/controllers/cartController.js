const cartService = require("../services/cartService");

// ✅ Ürün sepete ekle
async function addToCart(req, res) {
  try {
    const userId = req.user.userId || req.user.id;
    const { product_id, quantity } = req.body;
    
    console.log('AddToCart Debug:', {
      userId,
      product_id,
      quantity,
      body: req.body
    });

    const result = await cartService.addToCart({ 
      userId, 
      productId: product_id, 
      quantity 
    });
    
    res.status(200).json(result);
  } catch (err) {
    console.error('AddToCart Error:', err.message);
    res.status(400).json({ error: err.message });
  }
}

// ✅ Sepetteki ürün miktarını güncelle
async function updateCartItem(req, res) {
  try {
    const userId = req.user.userId || req.user.id;
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
    const userId = req.user.userId || req.user.id;
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
    const userId = req.user.userId || req.user.id;
    const result = await cartService.clearCart(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kullanıcının sepetini getir
async function getCart(req, res) {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await cartService.getCart(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kuponu uygula
async function applyCouponToCart(req, res) {
  try {
    const userId = req.user.userId || req.user.id;
    const { couponCode } = req.body;
    console.log('applyCouponToCart gelen userId:', userId, 'couponCode:', couponCode);
    await cartService.applyCouponToCart({ userId, couponCode });
    // Kupon uygulandıktan sonra güncel sepeti getir
    const updatedCart = await cartService.getCart(userId);
    res.status(200).json(updatedCart);
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
