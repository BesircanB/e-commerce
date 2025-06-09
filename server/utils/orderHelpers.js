// Toplam, indirim ve final total hesapla
function calculateTotal(cartItems, campaign = null) {
  let total = 0;
  let discount = 0;

  for (const item of cartItems) {
    const price = item.products?.price || 0;
    const quantity = item.quantity || 1;
    total += price * quantity;
  }

  if (campaign?.discount_percent > 0) {
    discount = total * (campaign.discount_percent / 100);
  }

  const finalTotal = parseFloat((total - discount).toFixed(2));

  return { total, discount, finalTotal };
}

// İlk kupon kodunu çek (eğer varsa)
function extractCouponCode(cartItems) {
  return cartItems.find(item => item.coupon_code)?.coupon_code || null;
}

// cartItems → order_items payload'ına dönüştür
function buildOrderItems(cartItems) {
  return cartItems.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.products?.price || 0,
  }));
}

module.exports = {
  calculateTotal,
  extractCouponCode,
  buildOrderItems,
};
