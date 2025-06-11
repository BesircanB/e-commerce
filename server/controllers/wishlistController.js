const wishlistService = require("../services/wishlistService");





// GET /api/wishlist
async function getWishlist(req, res) {
  try {

    console.log("getWishlist req.user:", req.user);
    const userId = req.user.id || req.user.userId;
    const wishlist = await wishlistService.getWishlist(userId,req.body);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/wishlist
async function addToWishlist(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const productId = Number(req.body.product_id);
    const result = await wishlistService.addToWishlist(userId, productId);
    res.status(201).json({ message: "Ürün favorilere eklendi", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/wishlist/:productId
async function removeFromWishlist(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    // Hem product_id hem productId parametrelerini kontrol et
    const productId = Number(req.params.product_id || req.params.productId);
    if (!productId || isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: "Geçersiz ürün ID" });
    }
    const result = await wishlistService.removeFromWishlist(userId, productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /api/wishlist/most-wishlisted (admin)
async function getMostWishlistedProducts(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Yetkisiz erişim" });
    }
    const limit = Number(req.query.limit) || 10;
    const result = await wishlistService.getMostWishlistedProducts(limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getMostWishlistedProducts,
};
