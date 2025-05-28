// server/controllers/adminController.js
const supabase = require("../services/supabase");

const getAdminMetrics = async (req, res) => {
  try {
    // 1. Bekleyen sipariş sayısı
    const { count: pendingCount, error: pendErr } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (pendErr) throw pendErr;

    // 2. Aylık ciro (geçerli ay)
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString();
    const { data: revenueData, error: revErr } = await supabase
      .from("orders")
      .select("sum:sum(total_amount)", { head: true })
      .eq("status", "paid")
      .gte("created_at", startOfMonth);
    if (revErr) throw revErr;
    const monthlyRevenue = revenueData?.sum || 0;

    // 3. En çok satılan 5 ürün
    const { data: topProducts, error: topErr } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .neq("quantity", 0);
    if (topErr) throw topErr;

    const salesByProduct = topProducts.reduce((acc, item) => {
      acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
      return acc;
    }, {});
    const sorted = Object.entries(salesByProduct)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const productIds = sorted.map(([id]) => Number(id));
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id, name")
      .in("id", productIds);
    if (prodErr) throw prodErr;

    const topSelling = sorted.map(([id, qty]) => {
      const prod = products.find((p) => p.id === Number(id));
      return { productId: Number(id), name: prod?.name || "—", sold: qty };
    });

    return res.json({
      pendingOrders: pendingCount,
      monthlyRevenue,
      topSelling,
    });
  } catch (err) {
    console.error("Admin metrics error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAdminMetrics };
