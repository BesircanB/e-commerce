const supabase = require("../supabase");
const { countWishlistProducts } = require("../../utils/productAnalytics");

async function getTopWishedProducts(limit = 10) {
  const { data: wishlistItems, error: wishErr } = await supabase
    .from("wishlist")
    .select("product_id");

  if (wishErr) throw wishErr;

  const ranked = countWishlistProducts(wishlistItems).slice(0, limit);
  const productIds = ranked.map(p => p.product_id);

  const { data: products, error: prodErr } = await supabase
    .from("crud")
    .select("id, name, price, image_url")
    .in("id", productIds);

  if (prodErr) throw prodErr;

  return ranked.map(entry => {
    const product = products.find(p => String(p.id) === String(entry.product_id));
    return {
      ...entry,
      product: product || null,
    };
  });
}

module.exports = getTopWishedProducts;
