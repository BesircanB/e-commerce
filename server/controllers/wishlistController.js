const wishlistService = require("../services/wishlistService");

// GET /api/wishlist
async function getWishlist(req, res) {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/wishlist/:productId
async function addToWishlist(req, res) {
  try {
    const productId = Number(req.params.productId);
    const result = await wishlistService.addToWishlist(req.user.id, productId);
    res.status(201).json({ message: "Ürün favorilere eklendi", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/wishlist/:productId
async function removeFromWishlist(req, res) {
  try {
    const productId = Number(req.params.productId);
    const result = await wishlistService.removeFromWishlist(req.user.id, productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
