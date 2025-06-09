const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

const {
  createCampaign,
  getAllCampaigns,
  getCampaignByCode,
  updateCampaign,
  toggleCampaignStatus,
  deleteCampaign
} = require("../controllers/campaignController");

// ✅ Public: Kodla kampanya doğrulama
router.get("/code/:code", getCampaignByCode);

// ✅ Public: Aktif kampanyaları listele (sepette kullanılacak)
router.get("/", (req, res) => {
  req.query.onlyActive = "true"; // aktif filtre zorlanır
  getAllCampaigns(req, res);
});

// ✅ Admin: Tüm kampanyaları listele
router.get("/admin", verifyToken, checkAdmin, getAllCampaigns);

// ✅ Admin: Yeni kampanya oluştur
router.post("/admin", verifyToken, checkAdmin, createCampaign);

// ✅ Admin: Kampanya güncelle
router.put("/admin/:id", verifyToken, checkAdmin, updateCampaign);

// ✅ Admin: Aktiflik aç/kapa
router.patch("/admin/:id/visibility", verifyToken, checkAdmin, toggleCampaignStatus);

// ✅ Admin: Kampanyayı sil
router.delete("/admin/:id", verifyToken, checkAdmin, deleteCampaign);

module.exports = router;
