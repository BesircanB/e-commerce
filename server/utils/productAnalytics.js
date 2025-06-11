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
function countProductSales(orderItems = []) {
  const salesMap = {};

  for (const item of orderItems) {
    const id = item.product_id;
    const qty = item.quantity || 0;

    if (!salesMap[id]) salesMap[id] = 0;
    salesMap[id] += qty;
  }

  return Object.entries(salesMap)
    .map(([product_id, total_sold]) => ({
      product_id,
      total_sold,
    }))
    .sort((a, b) => b.total_sold - a.total_sold);
}


module.exports = {
  countProductSales,
  countWishlistProducts,
};
