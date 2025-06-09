// Eklenen yeni fonksiyon:
function countWishlistProducts(wishlistItems = []) {
  const wishMap = {};

  for (const item of wishlistItems) {
    const id = item.product_id;
    if (!wishMap[id]) wishMap[id] = 0;
    wishMap[id]++;
  }

  return Object.entries(wishMap)
    .map(([product_id, count]) => ({
      product_id,
      total_wished: count,
    }))
    .sort((a, b) => b.total_wished - a.total_wished);
}

module.exports = {
  countProductSales,
  countWishlistProducts,
};
