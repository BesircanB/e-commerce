const supabase = require("../supabase");

async function deleteReview(userId, productId, reviewId) {
  if (!reviewId || isNaN(reviewId) || !productId || isNaN(productId)) {
    throw new Error("Geçersiz ID");
  }

  const { data: deleted, error: delErr } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", userId)
    .eq("product_id", productId)
    .select()
    .maybeSingle();

  if (delErr) throw delErr;
  if (!deleted) {
    throw new Error("Yorum bulunamadı veya yetkiniz yok");
  }

  return { message: "Yorum silindi" };
}

module.exports = deleteReview;
