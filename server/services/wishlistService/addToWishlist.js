const supabase = require("../supabase");
const { validateProductId } = require("../../utils/wishlistHelpers");

async function addToWishlist(userId, productId) {
  const validationError = validateProductId(productId);
  if (validationError) throw new Error(validationError);

  // Zaten ekli mi kontrol et
  const { data: existing, error: checkErr } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (checkErr) throw checkErr;
  if (existing) throw new Error("Ürün zaten favorilerde");

  // Favoriye ekle
  const { data, error } = await supabase
    .from("wishlist")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error) throw error;

  return data;
}

module.exports = addToWishlist;
