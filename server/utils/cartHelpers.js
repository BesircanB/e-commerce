function calculateCartTotal(cartItems) {
  let total = 0;
  let discount = 0;

  for (const item of cartItems) {
    const price = item.crud?.price || 0;
    total += price * item.quantity;

    // Gelecekte kupon tipi ve indirim oranına göre hesaplama yapılabilir
    if (item.coupon_code) {
      discount = total * 0.1; // örnek %10 indirim
    }
  }

  const finalTotal = total - discount;
  return {
    total,
    discount,
    finalTotal,
  };
}

module.exports = {
  calculateCartTotal,
};
