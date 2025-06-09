const supabase = require("../supabase");

async function getUserReviews(userId) {
  if (!userId) throw new Error("Kullanıcı kimliği eksik");

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      photo_url,
      created_at,
      product_id,
      crud (
        name,
        image_url
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { descending: true });

  if (error) throw error;

  return data;
}

module.exports = getUserReviews;
