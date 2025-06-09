const categoryService = require("../services/categoryService");

// ✅ Yeni kategori oluştur
async function createCategory(req, res) {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Tüm kategorileri getir
async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Kategori güncelle
async function updateCategory(req, res) {
  try {
    const updated = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kategori sil
async function deleteCategory(req, res) {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
