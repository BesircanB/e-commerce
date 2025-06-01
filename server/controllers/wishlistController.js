const supabase = require("../services/supabase");

// POST /api/wishlist → ürün ekle
const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id || isNaN(product_id)) {
    return res.status(400).json({ error: "Geçersiz ürün ID" });
  }

  try {
    const { error } = await supabase
      .from("wishlist")
      .insert([{ user_id: userId, product_id }]);

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Zaten favorilerde" });
      }
      throw error;
    }

    return res.status(201).json({ message: "Ürün favorilere eklendi" });
  } catch (err) {
    console.error("addToWishlist error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/wishlist → kullanıcının favorileri
const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select("id, product_id, created_at, crud(name, price, image_url)")
      .eq("user_id", userId);

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error("getWishlist error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /api/wishlist/:product_id → favorilerden kaldır
const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const productId = Number(req.params.product_id);

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Geçersiz ürün ID" });
  }

  try {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
    return res.json({ message: "Ürün favorilerden kaldırıldı" });
  } catch (err) {
    console.error("removeFromWishlist error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};
