const supabase = require("../supabase");
const { calculateCartTotal } = require("../../utils/cartHelpers");

async function getCart(userId) {
  const { data: cartItems, error } = await supabase
    .from("cart")
    .select("id, product_id, quantity, coupon_code, products(*)")
    .eq("user_id", userId);

  if (error) throw new Error("Sepet alınırken bir hata oluştu");

  // cartItems boş olabilir — bu hata değildir
  const result = calculateCartTotal(cartItems || []);
  return { items: cartItems || [], ...result };
}

module.exports = getCart;
