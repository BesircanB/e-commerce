const supabase = require("../supabase");
const { validateProductId } = require("../../utils/wishlistHelpers");

async function removeFromWishlist(userId, productId) {
  const validationError = validateProductId(productId);
  if (validationError) throw new Error(validationError);

  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;

  return { message: "Ürün favorilerden çıkarıldı" };
}

module.exports = removeFromWishlist;
