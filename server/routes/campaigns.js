// server/routes/campaigns.js

const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

const {
  getActiveCampaigns,
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require("../controllers/campaignController");

// ✅ PUBLIC → /api/campaigns (çünkü mount: app.use("/api/campaigns", ...))
router.get("/", getActiveCampaigns);

// ✅ ADMIN → /api/admin/campaigns (çünkü mount: app.use("/api/admin", ...))
router.get("/campaigns", verifyToken, checkAdmin, getAllCampaigns);
router.post("/campaigns", verifyToken, checkAdmin, createCampaign);
router.put("/campaigns/:id", verifyToken, checkAdmin, updateCampaign);
router.delete("/campaigns/:id", verifyToken, checkAdmin, deleteCampaign);

module.exports = router;
