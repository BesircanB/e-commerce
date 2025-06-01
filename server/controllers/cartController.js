const supabase = require("../services/supabase");
const supabaseAdmin = require("../services/supabase").supabaseAdmin;

// Sepete ekle veya var ise adeti güncelle
const addToCart = async (req, res) => {
  const user_id = req.user.id; // UUID olarak kullan
  const { product_id, quantity = 1 } = req.body;

  if (quantity <= 0) {
  return res.status(400).json({ error: "Quantity 0'dan büyük olmalıdır" });
  }


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

const applyCouponToCart = async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Kupon kodu zorunludur" });
  }

  try {
        // Kupon geçerli mi?
        // Zaten aynı kupon uygulanmış mı kontrol et
    const { data: existingCart, error: existingErr } = await supabase
      .from("cart")
      .select("coupon_code")
      .eq("user_id", userId)
      .limit(1);

    if (existingErr) throw existingErr;
    if (existingCart && existingCart.length > 0 && existingCart[0].coupon_code === code) {
      return res.status(400).json({ error: "Bu kupon zaten sepetinize uygulanmış" });
    }

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("code", code)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .single();

    if (error || !campaign) {
      return res.status(404).json({ error: "Geçerli bir kupon bulunamadı" });
    }

    // Kupon kodunu sepete uygula
    const { error: updateErr } = await supabase
      .from("cart")
      .update({ coupon_code: code })
      .eq("user_id", userId);

    if (updateErr) throw updateErr;

    return res.status(200).json({ message: "Kupon sepete uygulandı", campaign });
  } catch (err) {
    console.error("applyCouponToCart error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Sepeti getir
const getCart = async (req, res) => {
    const user_id = req.user.id;

  try {
    // Sepet verisini al
    const { data: cartItems, error } = await supabaseAdmin
      .from("cart")
      .select("id, product_id, quantity, created_at, coupon_code")
      .eq("user_id", user_id);

    if (error) throw error;

    // Eğer sepet boşsa direkt dön
    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json([]);
    }

    // Kupon kodu var mı kontrol et
    const couponCode = cartItems[0].coupon_code;
    let campaign = null;

    if (couponCode) {
      const { data: campData, error: campErr } = await supabase
        .from("campaigns")
        .select("name, discount_percent")
        .eq("code", couponCode)
        .maybeSingle();

      if (campErr) throw campErr;
      if (campData) campaign = campData;
    }

    return res.status(200).json({
      items: cartItems,
      coupon: campaign ? { code: couponCode, ...campaign } : null
    });
  } catch (err) {
    console.error("Cart get error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Sepet öğesini sil
const deleteCartItem = async (req, res) => {
  const user_id = req.user.id;
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
  const user_id = req.user.id;
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
  applyCouponToCart 
};
