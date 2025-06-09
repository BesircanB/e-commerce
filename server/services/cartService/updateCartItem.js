const supabase = require("../supabase");

async function updateCartItem({ userId, productId, quantity }) {
  if (!userId || !productId || !quantity || quantity <= 0) {
    throw new Error("Geçerli bir miktar girilmelidir");
  }

  const { error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw new Error("Ürün miktarı güncellenemedi");

  return { message: "Ürün miktarı güncellendi" };
}

module.exports = updateCartItem;
