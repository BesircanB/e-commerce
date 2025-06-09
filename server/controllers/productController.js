const productService = require("../services/productService");
const searchService = require("../services/searchService");

// ✅ Ürün oluştur (admin)
async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ message: "Ürün oluşturuldu", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Ürün güncelle (admin)
async function updateProduct(req, res) {
  try {
    const productId = Number(req.params.id);
    const updated = await productService.updateProduct(productId, req.body);
    res.status(200).json({ message: "Ürün güncellendi", product: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Tüm ürünleri getir (public)
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllVisibleProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Belirli bir ürün (public)
async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ error: "Ürün bulunamadı" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Admin paneli için ürün detayı (gizli ürünler dahil)
async function getProductByIdAdmin(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductByIdAdmin(id);
    if (!product) return res.status(404).json({ error: "Ürün bulunamadı" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Stok güncelleme (admin)
async function updateProductStock(req, res) {
  try {
    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);
    const updated = await productService.updateProductStock(id, quantity);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Ürünü sil (admin)
async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const result = await productService.deleteProduct(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kullanıcı tarafı ürün arama
async function searchPublicProducts(req, res) {
  try {
    const userId = req.user?.id || null;
    const products = await searchService.searchProductsPublic(userId, req.query);
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Admin paneli ürün arama
async function searchAdminProducts(req, res) {
  try {
    const products = await searchService.searchProductsAdmin(req.query);
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  getProductByIdAdmin,
  updateProductStock,
  deleteProduct,
  searchPublicProducts,
  searchAdminProducts,
};
