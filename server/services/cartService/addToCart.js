const supabase = require("../supabase");

async function addToCart({ userId, productId, quantity }) {
  if (!userId || !productId || !quantity || quantity <= 0) {
    throw new Error("Geçersiz ürün bilgisi");
  }

  const { data: existingItem, error: fetchError } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchError) throw new Error("Sepet kontrol hatası");

  if (existingItem) {
    // Miktarı artır
    const newQuantity = existingItem.quantity + quantity;

    const { error: updateError } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);

    if (updateError) throw new Error("Miktar güncellenemedi");
  } else {
    // Yeni ürün ekle
    const { error: insertError } = await supabase
      .from("cart")
      .insert([{ user_id: userId, product_id: productId, quantity }]);

    if (insertError) throw new Error("Sepete ekleme başarısız");
  }

  return { message: "Ürün sepete eklendi" };
}

module.exports = addToCart;
