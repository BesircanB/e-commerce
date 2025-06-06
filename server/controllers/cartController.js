const supabase = require("../services/supabase");
const supabaseAdmin = require("../services/supabase").supabaseAdmin;

const filterCampaignsByCategories = async (cartProductCategories, campaignIds) => {
  // Tüm kampanya-kategori eşleşmelerini getir
  const { data: mappings, error } = await supabase
    .from("campaign_categories")
    .select("campaign_id, category_id")
    .in("campaign_id", campaignIds);

  if (error) throw error;

  // Kampanyanın kategorilerinden en az biri sepet ürün kategorisine uyuyorsa eşleştir
  const validCampaignIds = new Set();

  for (const map of mappings) {
    if (cartProductCategories.includes(map.category_id)) {
      validCampaignIds.add(map.campaign_id);
    }
  }

  return Array.from(validCampaignIds);
};


// Sepete ekle veya var ise adeti güncelle
const addToCart = async (req, res) => {
  const user_id = req.user.id;
  const { product_id, quantity = 1 } = req.body;

  if (!product_id || quantity <= 0) {
    return res.status(400).json({ error: "Geçerli bir ürün ve miktar girin" });
  }

  try {
    // Ürün bilgilerini getir
    const { data: product, error: prodErr } = await supabase
      .from("crud")
      .select("id, stock")
      .eq("id", product_id)
      .maybeSingle();

    if (prodErr) throw prodErr;
    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    if (product.stock === 0) {
      return res.status(400).json({ error: "Ürün stokta yok" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: `Yalnızca ${product.stock} adet stokta mevcut` });
    }

    // Sepette ürün var mı kontrol et
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      const newQuantity = existing.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: `Sepette toplam miktar ${product.stock} adeti aşamaz` });
      }

      const { data, error } = await supabaseAdmin
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // Yeni ekleme
    const { data, error } = await supabaseAdmin
      .from("cart")
      .insert([{ user_id, product_id, quantity }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    console.error("Cart add/update error:", err);
    return res.status(500).json({ error: err.message });
  }
};


const applyCouponToCart = async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;

  try {
    // 1. Sepetteki ürünleri al
    const { data: cartItems, error: cartErr } = await supabaseAdmin
      .from("cart")
      .select("quantity, product_id")
      .eq("user_id", userId);

    if (cartErr) throw cartErr;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Sepetiniz boş" });
    }

    const productIds = cartItems.map(item => item.product_id);

    // 2. Ürün bilgileri: fiyat ve kategori
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id, price, category_id")
      .in("id", productIds);

    if (prodErr) throw prodErr;

    const cartProductCategories = [...new Set(products.map(p => p.category_id))]; // benzersiz kategori id’leri

    // 3. Sepet toplamını hesapla
    let total = 0;
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    const now = new Date().toISOString();

    // 4. Otomatik kampanyaları al
    const { data: autoCampaigns, error: autoErr } = await supabase
      .from("campaigns")
      .select("id, title, discount_type, discount_value, min_order_amount")
      .eq("apply_type", "auto")
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now);

    if (autoErr) throw autoErr;

    // 🔍 Kategorilere göre filtrele
    const autoCampaignIds = autoCampaigns.map(c => c.id);
    const validAutoCampaignIds = await filterCampaignsByCategories(cartProductCategories, autoCampaignIds);
    const filteredAutoCampaigns = autoCampaigns.filter(c => validAutoCampaignIds.includes(c.id));

    let autoDiscountTotal = 0;
    let autoDiscounts = [];

    for (const camp of filteredAutoCampaigns) {
      if (total >= camp.min_order_amount) {
        let discount = 0;
        if (camp.discount_type === "percentage") {
          discount = (total * camp.discount_value) / 100;
        } else if (camp.discount_type === "fixed") {
          discount = camp.discount_value;
        }
        autoDiscountTotal += discount;
        autoDiscounts.push({ title: camp.title, amount: discount });
      }
    }

    // 5. Kupon kontrolü
    let codeDiscount = 0;
    let codeDiscountInfo = null;

    if (code) {
      const { data: codeCampaign, error: codeErr } = await supabase
        .from("campaigns")
        .select("*")
        .eq("code", code)
        .eq("apply_type", "code")
        .eq("is_active", true)
        .lte("start_date", now)
        .gte("end_date", now)
        .maybeSingle();

      if (codeErr) throw codeErr;

      if (!codeCampaign) {
        return res.status(404).json({ error: "Geçerli bir kupon bulunamadı" });
      }

      // ❗ Kategorilere uyumlu mu?
      const matchIds = await filterCampaignsByCategories(cartProductCategories, [codeCampaign.id]);
      const isEligible = matchIds.includes(codeCampaign.id);

      if (!isEligible) {
        return res.status(400).json({
          error: "Bu kupon, sepetinizdeki ürün kategorileriyle uyumlu değil."
        });
      }

      if (total < codeCampaign.min_order_amount) {
        return res.status(400).json({
          error: `Bu kupon için minimum sepet tutarı ${codeCampaign.min_order_amount}₺ olmalıdır`
        });
      }

      if (codeCampaign.discount_type === "percentage") {
        codeDiscount = (total * codeCampaign.discount_value) / 100;
      } else if (codeCampaign.discount_type === "fixed") {
        codeDiscount = codeCampaign.discount_value;
      }

      await supabaseAdmin
        .from("cart")
        .update({ coupon_code: code })
        .eq("user_id", userId);

      codeDiscountInfo = {
        title: codeCampaign.title,
        code: codeCampaign.code,
        amount: codeDiscount
      };
    }

    const totalDiscount = autoDiscountTotal + codeDiscount;
    const finalTotal = Math.max(total - totalDiscount, 0);

    const enrichedItems = cartItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return { ...item, product: product || null };
    });

    return res.status(200).json({
      items: enrichedItems,
      original_total: total,
      discounts: {
        auto: autoDiscounts,
        code: codeDiscountInfo
      },
      total_discount: totalDiscount,
      final_total: finalTotal
    });
  } catch (err) {
    console.error("applyCouponToCart error:", err);
    return res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
};



// Sepeti getir
const getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    // 1. Sepeti getir
    const { data: cartItems, error } = await supabaseAdmin
      .from("cart")
      .select("id, product_id, quantity, created_at, coupon_code")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ items: [], message: "Sepet boş" });
    }

    const productIds = cartItems.map(item => item.product_id);

    // 2. Ürün bilgileri: fiyat ve kategori
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id, name, price, image_url, category_id")
      .in("id", productIds);

    if (prodErr) throw prodErr;

    const cartProductCategories = [...new Set(products.map(p => p.category_id))];

    // 3. Toplam fiyat
    let total = 0;
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product) total += Number(product.price) * item.quantity;
    }

    const now = new Date().toISOString();

    // 4. Otomatik kampanyaları getir
    const { data: autoCampaigns, error: autoErr } = await supabase
      .from("campaigns")
      .select("id, title, discount_type, discount_value, min_order_amount")
      .eq("apply_type", "auto")
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now);

    if (autoErr) throw autoErr;

    // 🔍 Kategori eşlemesi
    const autoCampaignIds = autoCampaigns.map(c => c.id);
    const validAutoCampaignIds = await filterCampaignsByCategories(cartProductCategories, autoCampaignIds);
    const filteredAutoCampaigns = autoCampaigns.filter(c => validAutoCampaignIds.includes(c.id));

    let autoDiscountTotal = 0;
    let autoDiscounts = [];

    for (const camp of filteredAutoCampaigns) {
      if (total >= camp.min_order_amount) {
        let discount = 0;
        if (camp.discount_type === "percentage") {
          discount = (total * camp.discount_value) / 100;
        } else if (camp.discount_type === "fixed") {
          discount = camp.discount_value;
        }
        autoDiscountTotal += discount;
        autoDiscounts.push({ title: camp.title, amount: discount });
      }
    }

    // 5. Kupon kodu kontrolü
    const couponCode = cartItems[0].coupon_code;
    let codeDiscount = 0;
    let codeDiscountInfo = null;

    if (couponCode) {
      const { data: campData, error: campErr } = await supabase
        .from("campaigns")
        .select("id, title, code, discount_type, discount_value, min_order_amount")
        .eq("code", couponCode)
        .eq("apply_type", "code")
        .eq("is_active", true)
        .lte("start_date", now)
        .gte("end_date", now)
        .maybeSingle();

      if (campErr) throw campErr;

      if (campData && total >= campData.min_order_amount) {
        // ❗ Kategorilere uyumlu mu?
        const matchIds = await filterCampaignsByCategories(cartProductCategories, [campData.id]);
        const isEligible = matchIds.includes(campData.id);

        if (isEligible) {
          if (campData.discount_type === "percentage") {
            codeDiscount = (total * campData.discount_value) / 100;
          } else if (campData.discount_type === "fixed") {
            codeDiscount = campData.discount_value;
          }

          codeDiscountInfo = {
            title: campData.title,
            code: campData.code,
            amount: codeDiscount
          };
        }
      }
    }

    // 6. Sepet ürünlerine ürün detaylarını ekle
    const enrichedItems = cartItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product: product || null
      };
    });

    // 7. Toplamlar
    const totalDiscount = autoDiscountTotal + codeDiscount;
    const finalTotal = Math.max(total - totalDiscount, 0);

    return res.status(200).json({
      items: enrichedItems,
      original_total: total,
      discounts: {
        auto: autoDiscounts,
        code: codeDiscountInfo
      },
      total_discount: totalDiscount,
      final_total: finalTotal
    });
  } catch (err) {
    console.error("Cart get error:", err);
    return res.status(500).json({ error: err.message });
  }
};



// Sepet öğesini sil
const deleteCartItem = async (req, res) => {
  const user_id = req.user.id;
  const id = Number(req.params.id); // ← bu id sepet satırının id’sidir

  if (isNaN(id)) {
    return res.status(400).json({ error: "Geçersiz ID" });
  }

  try {
    // Sepet satırının var olup olmadığını kontrol et
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("cart")
      .select("id")
      .eq("id", id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return res.status(404).json({ error: "Sepet öğesi bulunamadı" });
    }

    // 🔧 SADECE O satırı sil
    const { error: deleteError } = await supabaseAdmin
      .from("cart")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id);

    if (deleteError) throw deleteError;

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

  if (isNaN(id) || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Geçersiz ID veya miktar" });
  }

  try {
    // Hem id hem user_id ile eşleşen öğeyi bul
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("cart")
      .select("id, user_id, quantity")
      .eq("id", id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return res.status(404).json({ error: "Sepet öğesi bulunamadı" });
    }

    // Güncelle
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


const clearCart = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { error } = await supabaseAdmin
      .from("cart")
      .delete()
      .eq("user_id", user_id);

    if (error) throw error;

    return res.status(200).json({ message: "Sepet temizlendi" });
  } catch (err) {
    console.error("Cart clear error:", err);
    return res.status(400).json({ error: err.message });
  }
};










module.exports = {
  addToCart,
  getCart,
  deleteCartItem,
  updateCartItem,
  applyCouponToCart,
  clearCart
};
