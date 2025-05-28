// server/controllers/reviewController.js
const supabase = require("../services/supabase");

// Yeni yorum oluştur
const createReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user.id;
  if (!product_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Geçersiz product_id veya rating" });
  }
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ user_id, product_id, rating, comment }])
      .select();
    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err) {
    console.error("Create review error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Bir ürünün yorumları ve ortalama puanı
const getReviewsByProduct = async (req, res) => {
  const product_id = Number(req.params.productId);
  try {
    const { data: reviews, error: revErr } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, created_at")
      .eq("product_id", product_id)
      .order("created_at", { ascending: false });
    if (revErr) throw revErr;

    const { data: agg, error: aggErr } = await supabase
      .from("reviews")
      .select("avg:avg(rating)", { count: "exact" })
      .eq("product_id", product_id);
    if (aggErr) throw aggErr;

    return res.json({
      averageRating: parseFloat(agg[0].avg) || 0,
      reviews,
    });
  } catch (err) {
    console.error("Get reviews error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createReview, getReviewsByProduct };
