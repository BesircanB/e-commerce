const express = require('express');
const router = express.Router();
const { getModelColors, addModelColor } = require('../services/productModelColorService');

// GET /api/models/:modelId/colors - Bir modelin tüm renklerini getir
router.get('/models/:modelId/colors', async (req, res) => {
  try {
    const modelId = req.params.modelId;
    const colors = await getModelColors(modelId);
    res.json({ success: true, data: colors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/models/:modelId/colors - Bir modele yeni renk ekle
router.post('/models/:modelId/colors', async (req, res) => {
  try {
    const modelId = req.params.modelId;
    const { color, stock, price_adjustment } = req.body;
    if (!color) return res.status(400).json({ success: false, message: 'color zorunlu.' });
    const colorRow = await addModelColor(modelId, color, stock, price_adjustment);
    res.json({ success: true, data: colorRow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 