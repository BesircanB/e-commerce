const { supabaseAdmin } = require("../supabase");

async function removeFromCart({ userId, productId }) {
  if (!userId || !productId) {
    throw new Error("Eksik parametre: userId veya productId");
  }

  const { error } = await supabaseAdmin
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Delete error:", error);
    throw new Error("Sepetten ürün silinemedi");
  }

  return { message: "Ürün sepetten silindi" };
}

module.exports = removeFromCart;
