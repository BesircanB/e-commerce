const { supabaseAdmin } = require("../supabase");

async function updateCartItem({ userId, cartItemId, quantity }) {
  if (!userId || !cartItemId || quantity < 0) {
    throw new Error("Geçersiz parametreler");
  }

  const isGuest = userId.startsWith('guest_');
  const tableName = isGuest ? 'session_carts' : 'cart';
  const userField = isGuest ? 'session_id' : 'user_id';

  // Önce cart item'ı ve product bilgisini getir
  const { data: cartItem, error: fetchError } = await supabaseAdmin
    .from(tableName)
    .select("product_id")
    .eq("id", cartItemId)
    .eq(userField, userId)
    .single();

  if (fetchError || !cartItem) {
    throw new Error("Sepet öğesi bulunamadı");
  }

  if (quantity === 0) {
    // Miktarı 0 ise ürünü sil
    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq("id", cartItemId)
      .eq(userField, userId);

    if (error) throw new Error("Ürün silinemedi");
    return { message: "Ürün sepetten kaldırıldı" };
  }

  // Ürün stok kontrolü
  const { data: product } = await supabaseAdmin
    .from("crud")
    .select("stock")
    .eq("id", cartItem.product_id)
    .single();

  if (!product || quantity > product.stock) {
    throw new Error("Stok yetersiz");
  }

  // Miktar güncelle
  const updateData = isGuest 
    ? { quantity, updated_at: new Date().toISOString() }
    : { quantity };

  const { error } = await supabaseAdmin
    .from(tableName)
    .update(updateData)
    .eq("id", cartItemId)
    .eq(userField, userId);

  if (error) throw new Error("Miktar güncellenemedi");
  
  return { message: "Sepet güncellendi" };
}

module.exports = updateCartItem;
