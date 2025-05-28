// server/controllers/cartController.js
const supabase = require("../services/supabase");
const supabaseAdmin = require("../services/supabase").supabaseAdmin;

// Sepete ekle veya var ise adeti güncelle
const addToCart = async (req, res) => {
  const user_id = Number(req.user.id);
  if (isNaN(user_id)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  
  const { product_id, quantity = 1 } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ error: "product_id ve quantity zorunlu" });
  }

  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("cart")
      .select("id, quantity, user_id")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    } else {
      const { data, error } = await supabaseAdmin
        .from("cart")
        .insert([{ user_id, product_id, quantity }])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
  } catch (err) {
    console.error("Cart add/update error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Sepeti getir
const getCart = async (req, res) => {
  const user_id = Number(req.user.id);
  if (isNaN(user_id)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  try {
    const { data, error } = await supabase
      .from("cart")
      .select("id, product_id, quantity, created_at")
      .eq("user_id", user_id);
    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error("Cart get error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Sepet öğesini sil
const deleteCartItem = async (req, res) => {
  const user_id = Number(req.user.id);
  if (isNaN(user_id)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  const id = Number(req.params.id);
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("cart")
      .select("id, user_id")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: "Sepet öğesi bulunamadı" });
    }
    if (existing.user_id !== user_id) {
      return res.status(403).json({ error: "Bu kaydı silme yetkiniz yok" });
    }

    const { error } = await supabaseAdmin
      .from("cart")
      .delete()
      .eq("id", id);
    if (error) throw error;

    return res.status(200).json({ message: "Ürün sepetten kaldırıldı" });
  } catch (err) {
    console.error("Cart delete error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Adeti güncelle
const updateCartItem = async (req, res) => {
  const user_id = Number(req.user.id);
  if (isNaN(user_id)) return res.status(401).json({ error: "Geçersiz kullanıcı" });

  const id = Number(req.params.id);
  const { quantity } = req.body;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("cart")
      .select("id, user_id, quantity")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: "Sepet öğesi bulunamadı" });
    }
    if (existing.user_id !== user_id) {
      return res.status(403).json({ error: "Bu kaydı güncelleme yetkiniz yok" });
    }

    const { data, error } = await supabaseAdmin
      .from("cart")
      .update({ quantity })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("Cart update error:", err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  deleteCartItem,
  updateCartItem,
};