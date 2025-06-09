const reviewService = require("../services/reviewService");

// ✅ GET: Ürüne ait yorumları getir
async function getReviewsByProductId(req, res) {
  try {
    const productId = Number(req.params.product_id);
    const data = await reviewService.getReviewsByProduct(productId);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ POST: Yorum oluştur
async function createReview(req, res) {
  try {
    const productId = Number(req.params.product_id);
    const userId = req.user.id;
    const created = await reviewService.createReview(userId, productId, req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ PUT: Yorum güncelle
async function updateReview(req, res) {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.product_id);
    const reviewId = Number(req.params.id);
    const updated = await reviewService.updateReview(userId, productId, reviewId, req.body);
    res.json({ message: "Yorum güncellendi", review: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ DELETE: Yorum sil
async function deleteReview(req, res) {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.product_id);
    const reviewId = Number(req.params.id);
    const result = await reviewService.deleteReview(userId, productId, reviewId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ GET: Kullanıcının tüm yorumları
async function getUserReviews(req, res) {
  try {
    const userId = req.user.id;
    const reviews = await reviewService.getUserReviews(userId);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
};
