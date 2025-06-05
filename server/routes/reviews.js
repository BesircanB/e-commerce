// server/routes/reviews.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} = require("../controllers/reviewController");

// ✅ Public: Bir ürünün yorumlarını getir
router.get("/products/:product_id/reviews", getReviewsByProductId);

// ✅ Kullanıcı: Yorum oluştur
router.post("/products/:product_id/reviews", verifyToken, createReview);

// ✅ Kullanıcı: Yorum güncelle
router.put("/products/:product_id/reviews/:id", verifyToken, updateReview);

// ✅ Kullanıcı: Yorum sil
router.delete("/products/:product_id/reviews/:id", verifyToken, deleteReview);

// ✅ Kullanıcı: Tüm yorum geçmişini getir
router.get("/users/me/reviews", verifyToken, getUserReviews);


module.exports = router;
