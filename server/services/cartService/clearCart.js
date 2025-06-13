const { supabaseAdmin } = require("../supabase");

async function clearCart(userId) {
  if (!userId) {
    throw new Error("Kullanıcı ID gerekli");
  }

  const isGuest = userId.startsWith('guest_');
  const tableName = isGuest ? 'session_carts' : 'cart';
  const userField = isGuest ? 'session_id' : 'user_id';

  const { error } = await supabaseAdmin
    .from(tableName)
    .delete()
    .eq(userField, userId);

  if (error) {
    console.error("Clear cart error:", error);
    throw new Error("Sepet temizlenemedi");
  }

  return { message: "Sepet temizlendi" };
}

module.exports = clearCart;
