const adminService = require("../services/adminService");
const productService = require("../services/productService");

async function getAdminMetrics(req, res) {
  try {
    const metrics = await adminService.getAdminMetrics();
    return res.status(200).json(metrics);
  } catch (err) {
    console.error("getAdminMetrics error:", err.message);
    return res.status(500).json({ error: "Admin metrikleri alınamadı" });
  }
}

async function getRevenueStats(req, res) {
  try {
    const stats = await adminService.fetchRevenueStats();
    return res.status(200).json(stats);
  } catch (err) {
    console.error("getRevenueStats error:", err.message);
    return res.status(500).json({ error: "Gelir verileri alınamadı" });
  }
}

async function getMonthlyRevenue(req, res) {
  try {
    const result = await adminService.fetchMonthlyRevenue();
    return res.status(200).json(result);
  } catch (err) {
    console.error("getMonthlyRevenue error:", err.message);
    return res.status(500).json({ error: "Aylık gelir getirilemedi" });
  }
}

// --- 🔍 Admin ürün arama
async function searchAdminProducts(req, res) {
  try {
    const products = await require("../services/searchService").searchProductsAdmin(req.query);
    return res.status(200).json(products);
  } catch (err) {
    console.error("searchAdminProducts error:", err.message);
    return res.status(500).json({ error: "Ürün araması yapılamadı" });
  }
}

async function getTopSelling(req, res) {
  try {
    const top = await adminService.getTopSellingProducts();
    return res.status(200).json(top);
  } catch (err) {
    console.error("getTopSellingProducts error:", err.message);
    return res.status(500).json({ error: "Satış verileri alınamadı" });
  }
}

async function getTopWished(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;
    const result = await require("../services/adminService").getTopWishedProducts(limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAdminMetrics,
  getRevenueStats,
  getMonthlyRevenue,
  searchAdminProducts,
  getTopSelling,
  getTopWished
};
