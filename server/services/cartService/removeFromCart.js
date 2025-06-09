const supabase = require("../supabase");

async function removeFromCart({ userId, productId }) {
  if (!userId || !productId) {
    throw new Error("Eksik parametre: userId veya productId");
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw new Error("Sepetten ürün silinemedi");

  return { message: "Ürün sepetten silindi" };
}

module.exports = removeFromCart;
