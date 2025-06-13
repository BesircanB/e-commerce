const express = require('express');
const router = express.Router();
const { getProductModels, addProductModel } = require('../services/productModelService');

// GET /api/products/:id/models - Bir ürünün tüm modellerini getir
router.get('/products/:id/models', async (req, res) => {
  try {
    const productId = req.params.id;
    const models = await getProductModels(productId);
    res.json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products/:id/models - Ürüne yeni model ekle
router.post('/products/:id/models', async (req, res) => {
  try {
    const productId = req.params.id;
    const { model_name } = req.body;
    if (!model_name) return res.status(400).json({ success: false, message: 'model_name zorunlu.' });
    const model = await addProductModel(productId, model_name);
    res.json({ success: true, data: model });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 