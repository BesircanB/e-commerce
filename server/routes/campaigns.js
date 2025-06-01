const express = require("express");
const router = express.Router();
const { getActiveCampaigns } = require("../controllers/campaignController");

// Herkes erişebilir
router.get("/", getActiveCampaigns);

module.exports = router;
