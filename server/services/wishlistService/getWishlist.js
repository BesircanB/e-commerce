const supabase = require("../supabase");
const { formatWishlistProduct } = require("../../utils/wishlistHelpers");

async function getWishlist(userId) {
  if (!userId) throw new Error("Kullanıcı ID gerekli");

  const { data, error } = await supabase
    .from("wishlist")
    .select(`
      id,
      product_id,
      products (
        id,
        name,
        image_url,
        price
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    product: formatWishlistProduct(item.products),
  }));
}

module.exports = getWishlist;
