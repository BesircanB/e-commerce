const supabase = require("../supabase");


const TAX_RATE = 0.2;

async function getAdminMetrics() {
  const [users, orders, campaigns, products] = await Promise.all([
    supabase.from("users").select("id"),
    supabase.from("orders").select("id, final_total, status"),
    supabase.from("campaigns").select("id").eq("is_active", true),
    supabase.from("crud").select("id").eq("is_visible", true),
  ]);

  const totalUsers = users.data?.length || 0;
  const totalOrders = orders.data?.length || 0;
  const totalCampaigns = campaigns.data?.length || 0;
  const totalProducts = products.data?.length || 0;

  const paidOrders = orders.data?.filter(o => o.status === "paid") || [];
  const netRevenue = paidOrders.reduce((acc, o) => acc + (o.final_total || 0), 0);
  const estimatedTax = Math.round(netRevenue * TAX_RATE * 100) / 100;
  const grossRevenue = netRevenue + estimatedTax;

  return {
    totalUsers,
    totalOrders,
    totalCampaigns,
    totalProducts,
    netRevenue,
    estimatedTax,
    grossRevenue,
  };
}

module.exports = getAdminMetrics;
