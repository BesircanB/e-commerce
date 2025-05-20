// controllers/cartController.js
const supabase = require("../services/supabase");

// Sepete ekle
const addToCart = async (req, res) => {
  const user_id = req.user.id;
  const { product_id, quantity = 1 } = req.body;
  const { data, error } = await supabase
    .from("cart")
    .upsert([{ user_id, product_id, quantity }], { onConflict: ["user_id","product_id"] })
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};

// Sepeti getir
const getCart = async (req, res) => {
  const user_id = req.user.id;
  const { data, error } = await supabase
    .from("cart")
    .select("id,product_id,quantity,created_at, crud(*)")
    .eq("user_id", user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Sepetten ürün sil
const removeFromCart = async (req, res) => {
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

// Adet güncelle
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

module.exports = { addToCart, getCart, removeFromCart, updateCartItem };
