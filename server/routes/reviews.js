// server/routes/reviews.js

const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// ✅ Public: Bir ürünün tüm yorumlarını getir
router.get("/products/:id/reviews", getReviewsByProductId);

// ✅ Kullanıcı: Yorum oluştur
router.post("/", verifyToken, createReview);

// ✅ Kullanıcı: Yorum güncelle
router.put("/:id", verifyToken, updateReview);

// ✅ Kullanıcı: Yorum sil
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;
