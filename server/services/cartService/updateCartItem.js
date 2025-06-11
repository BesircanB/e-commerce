const { supabaseAdmin } = require("../supabase");

async function updateCartItem({ userId, productId, quantity }) {
  if (!userId || !productId || !quantity || quantity <= 0) {
    throw new Error("Geçerli bir miktar girilmelidir");
  }

  // Önce ürünün stok durumunu kontrol et
  const { data: product, error: productError } = await supabaseAdmin
    .from("crud")
    .select("stock")
    .eq("id", productId)
    .single();

  if (productError) throw new Error("Ürün kontrol edilemedi");
  if (!product) throw new Error("Ürün bulunamadı");
  if (quantity > product.stock) {
    throw new Error(`Üzgünüz, sadece ${product.stock} adet stok mevcut`);
  }

  const { error } = await supabaseAdmin
    .from("cart")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Update error:", error);
    throw new Error("Ürün miktarı güncellenemedi");
  }

  return { message: "Ürün miktarı güncellendi" };
}

module.exports = updateCartItem;
