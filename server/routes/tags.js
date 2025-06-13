const express = require("express");
const router = express.Router();

const { getAllTags } = require("../controllers/tagController");

// ✅ Public: Tüm etiketleri listele
router.get("/", getAllTags);

module.exports = router; 