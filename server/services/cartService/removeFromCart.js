const { supabaseAdmin } = require("../supabase");

async function removeFromCart({ userId, cartItemId }) {
  if (!userId || !cartItemId) {
    throw new Error("Kullanıcı ID ve sepet öğesi ID gereklidir");
  }

  const isGuest = userId.startsWith('guest_');
  const tableName = isGuest ? 'session_carts' : 'cart';
  const userField = isGuest ? 'session_id' : 'user_id';

  const { error } = await supabaseAdmin
    .from(tableName)
    .delete()
    .eq("id", cartItemId)
    .eq(userField, userId);

  if (error) {
    console.error("Remove from cart error:", error);
    throw new Error("Ürün sepetten silinemedi");
  }

  return { message: "Ürün sepetten kaldırıldı" };
}

module.exports = removeFromCart;
