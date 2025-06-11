const supabase = require("../supabase");

// En çok wishlistte olan ürünleri ve sayısını getirir
async function getMostWishlistedProducts(limit = 10) {
  // 1. Tüm wishlist kayıtlarını çek
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id");

  if (error) throw error;

  // 2. Gruplama ve sayma işlemini JS ile yap
  const countMap = {};
  data.forEach(item => {
    countMap[item.product_id] = (countMap[item.product_id] || 0) + 1;
  });

  // 3. En çok eklenenleri sırala ve limitle
  const sorted = Object.entries(countMap)
    .map(([product_id, count]) => ({ product_id: Number(product_id), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  // 4. Ürün bilgilerini topluca çek
  const productIds = sorted.map(item => item.product_id);
  const { data: products, error: prodErr } = await supabase
    .from("crud")
    .select("id, name, image_url, price")
    .in("id", productIds);

  if (prodErr) throw prodErr;

  // 5. Sonuçları birleştir
  return sorted.map(item => ({
    product: products.find(p => p.id === item.product_id) || { id: item.product_id },
    wishlist_count: item.count
  }));
}

module.exports = getMostWishlistedProducts;