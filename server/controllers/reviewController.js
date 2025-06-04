const supabase = require("../services/supabase");

// GET /api/products/:product_id/reviews → Ürüne ait yorumları getir
const getReviewsByProductId = async (req, res) => {
  const productId = Number(req.params.product_id);
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Geçersiz ürün ID" });
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, photo_url, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error("getReviewsByProductId error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/products/:product_id/reviews → Yeni yorum oluştur
const createReview = async (req, res) => {
  const userId = req.user.id;
  const product_id = Number(req.params.product_id);
  const { rating, comment, photo_url } = req.body;

  if (isNaN(product_id)) {
    return res.status(400).json({ error: "Geçersiz ürün ID" });
  }

  if (comment && (rating == null || rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "Yorum için geçerli yıldız puanı gerekir (1-5)" });
  }

  try {
    // Zaten yorum yapılmış mı?
    const { data: existing, error: checkErr } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", product_id)
      .maybeSingle();

    if (checkErr) throw checkErr;
    if (existing) {
      return res.status(400).json({ error: "Bu ürüne zaten yorum yaptınız" });
    }

    // Kullanıcı bu ürünü sipariş etmiş mi?
    const { data: validOrders, error: orderErr } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .neq("status", "cancelled");

    if (orderErr) throw orderErr;
    const orderIds = validOrders.map(o => o.id);

    const { data: orderedItems, error: itemErr } = await supabase
      .from("order_items")
      .select("product_id")
      .in("order_id", orderIds)
      .eq("product_id", product_id);

    if (itemErr) throw itemErr;
    if (!orderedItems || orderedItems.length === 0) {
      return res.status(403).json({ error: "Bu ürünü satın almadığınız için yorum yapamazsınız" });
    }

    const insertData = {
      user_id: userId,
      product_id,
      rating,
      comment,
      photo_url
    };

    const { data, error } = await supabase
      .from("reviews")
      .insert([insertData])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err) {
    console.error("createReview error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:product_id/reviews/:id → Yorum güncelle
const updateReview = async (req, res) => {
  const userId = req.user.id;
  const reviewId = Number(req.params.id);
  const productId = Number(req.params.product_id);
  const { rating, comment, photo_url } = req.body;

  if (isNaN(reviewId) || isNaN(productId)) {
    return res.status(400).json({ error: "Geçersiz ID" });
  }

  if (comment && rating == null) {
    return res.status(400).json({ error: "Yorum için yıldız zorunludur" });
  }

  if (rating != null && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "Yıldız puanı 1 ile 5 arasında olmalıdır" });
  }

  try {
    const { data: existing, error: fetchErr } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: "Yorum bulunamadı veya yetkiniz yok" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, comment, photo_url })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;
    return res.json({ message: "Yorum güncellendi", review: data });
  } catch (err) {
    console.error("updateReview error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/products/:product_id/reviews/:id → Yorum sil
const deleteReview = async (req, res) => {
  const userId = req.user.id;
  const reviewId = Number(req.params.id);
  const productId = Number(req.params.product_id);

  if (isNaN(reviewId) || isNaN(productId)) {
    return res.status(400).json({ error: "Geçersiz ID" });
  }

  try {
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
      return res.status(404).json({ error: "Yorum bulunamadı veya yetkiniz yok" });
    }

    return res.json({ message: "Yorum silindi" });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview
};
