const supabase = require("../supabase");
const {
  validateRating,
  cleanComment,
} = require("../../utils/reviewHelpers");

async function updateReview(userId, productId, reviewId, { rating, comment, photo_url }) {
  if (!reviewId || isNaN(reviewId) || !productId || isNaN(productId)) {
    throw new Error("Geçersiz ID");
  }

  if (comment && rating == null) {
    throw new Error("Yorum için yıldız zorunludur");
  }

  if (rating != null && !validateRating(rating)) {
    throw new Error("Yıldız puanı 1 ile 5 arasında olmalıdır");
  }

  // Yorum gerçekten kullanıcıya mı ait?
  const { data: existing, error: fetchErr } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchErr || !existing) {
    throw new Error("Yorum bulunamadı veya yetkiniz yok");
  }

  const { data: updated, error: updateErr } = await supabase
    .from("reviews")
    .update({
      rating,
      comment: cleanComment(comment),
      photo_url,
    })
    .eq("id", reviewId)
    .select()
    .single();

  if (updateErr) throw updateErr;

  return updated;
}

module.exports = updateReview;
