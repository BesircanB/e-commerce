// server/controllers/cartController.js
const supabase = require("../services/supabase");

// Sepete ekle veya var ise adeti güncelle
const addToCart = async (req, res) => {
  console.log("🔥 addToCart handler çağrıldı:", { user: req.user.id, body: req.body });

  const user_id = req.user.id;
  const { product_id, quantity = 1 } = req.body;

  try {
    // 1) Aynı kayıt var mı kontrol et
    const { data: existing, error: fetchError } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    // 2) fetchError kodu PGRST116 (no rows) değilse fırlat
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existing) {
      // 3a) Kayıt varsa adeti güncelle
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select();
      if (error) throw error;
      return res.status(200).json(data[0]);
    } else {
      // 3b) Yoksa yeni satır ekle
      const { data, error } = await supabase
        .from("cart")
        .insert({ user_id, product_id, quantity })
        .select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }
  } catch (err) {
    console.error("Cart add/update error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Sepeti getir
const getCart = async (req, res) => {
  const user_id = req.user.id;
  const { data, error } = await supabase
    .from("cart")
    .select("id, product_id, quantity, created_at, crud(*)")
    .eq("user_id", user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Sepet öğesini sil
const deleteCartItem = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Ürün sepetten kaldırıldı" });
};

// Adeti güncelle
const updateCartItem = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;
  const { data, error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("id", id)
    .eq("user_id", user_id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

module.exports = { addToCart, getCart, deleteCartItem, updateCartItem };
