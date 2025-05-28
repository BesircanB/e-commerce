const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { createReview, getReviewsByProduct } = require("../controllers/reviewController");

// Yeni yorum ekle (kayıtlı kullanıcı)
router.post("/", verifyToken, createReview);

// Bir ürünün yorumlarını getir
router.get("/product/:productId", getReviewsByProduct);

module.exports = router;
