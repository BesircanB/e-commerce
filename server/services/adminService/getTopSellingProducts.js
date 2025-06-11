const supabase = require("../supabase");
const { countProductSales } = require("../../utils/productAnalytics");

async function getTopSellingProducts(limit = 10) {
  const { data: orderItems, error: itemsErr } = await supabase
    .from("order_items")
    .select("product_id, quantity");

  if (itemsErr) throw itemsErr;

  const rankedSales = countProductSales(orderItems).slice(0, limit);
  const productIds = rankedSales.map(p => p.product_id);

  const { data: products, error: prodErr } = await supabase
    .from("crud")
    .select("id, name, image_url, price")
    .in("id", productIds);

  if (prodErr) throw prodErr;

  return rankedSales.map(rank => {
    const product = products.find(p => String(p.id) === String(rank.product_id));
    return {
      ...rank,
      product: product || null,
    };
  });
}

module.exports = getTopSellingProducts;
