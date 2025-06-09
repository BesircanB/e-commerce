const supabase = require("../supabase");

async function clearCart(userId) {
  if (!userId) throw new Error("Kullanıcı ID eksik");

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error("Sepet temizlenemedi");

  return { message: "Sepet başarıyla temizlendi" };
}

module.exports = clearCart;
