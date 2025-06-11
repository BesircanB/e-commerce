const productService = require("../services/productService");
const searchService = require("../services/searchService");
const supabase = require("../services/supabase");



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
    const filters = req.query;
    const products = await productService.getAllProducts(filters);
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
    const userId = req.user?.id || req.user?.userId;
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
// ✅ Tüm ürünleri getir (admin)
async function getAllProductsAdmin(req, res) {
  try {
    const filters = req.query;
    const products = await productService.getAllProductsAdmin(filters);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Ürün görünürlüğünü güncelle (admin)
async function updateProductVisibility(req, res) {
  try {
    const id = Number(req.params.id);
    const { is_visible } = req.body;

    const updated = await productService.toggleVisibility(id, is_visible);
    res.status(200).json({ message: "Görünürlük güncellendi", product: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
// Kullanıcının ürünü satın alıp almadığını kontrol et
async function checkIfUserPurchased(req, res) {
  try {
    const userId = req.user?.id || req.user?.userId;
    const productId = Number(req.params.id);
    console.log("[checkIfUserPurchased] userId:", userId, "productId:", productId);
    console.log("[checkIfUserPurchased] headers.authorization:", req.headers.authorization);

    if (!userId || !productId) {
      console.log("[checkIfUserPurchased] HATA: Geçersiz kullanıcı veya ürün ID");
      return res.status(400).json({ error: "Geçersiz kullanıcı veya ürün ID" });
    }

    // 1. Kullanıcının siparişlerini bul
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId);

    if (ordersError) throw new Error(ordersError.message);

    const orderIds = (orders || []).map(o => o.id);
    if (orderIds.length === 0) {
      return res.status(200).json({ purchased: false });
    }

    // 2. Bu siparişlerde ilgili ürün var mı kontrol et
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("id")
      .in("order_id", orderIds)
      .eq("product_id", productId);

    if (itemsError) throw new Error(itemsError.message);

    const hasPurchased = (orderItems || []).length > 0;
    res.status(200).json({ purchased: hasPurchased });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  getAllProductsAdmin,
  updateProductVisibility,
  checkIfUserPurchased
};
