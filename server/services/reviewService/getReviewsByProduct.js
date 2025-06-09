const supabase = require("../supabase");
const { formatReviewUserName } = require("../../utils/reviewHelpers");

async function getReviewsByProduct(productId) {
  if (!productId || isNaN(productId)) {
    throw new Error("Geçersiz ürün ID");
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      user_id,
      rating,
      comment,
      photo_url,
      created_at,
      users (
        name
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((r) => ({
    ...r,
    users: {
      name: formatReviewUserName(r.users?.name),
    },
  }));
}

module.exports = getReviewsByProduct;
