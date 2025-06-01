const supabase = require("../services/supabase");
const supabaseAdmin = require("../services/supabase").supabaseAdmin;
const { sendMail } = require("../services/emailService");

// Sipariş oluştur
// Sipariş oluştur
async function createOrder(req, res) {
  const userId = req.user.id;
  const userEmail = req.user.email;

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Geçersiz kullanıcı" });
  }

  try {
    // 1. Sepetteki ürünleri al
    let items = Array.isArray(req.body.items) && req.body.items.length
      ? req.body.items
      : (await supabaseAdmin
          .from("cart")
          .select("product_id, quantity")
          .eq("user_id", userId)).data;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Sipariş için ürün seçmelisiniz" });
    }

    // 2. Ürünleri al ve stok/fiyat kontrolü yap
    const productIds = items.map(i => i.product_id);
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id, price, stock")
      .in("id", productIds);
    if (prodErr) throw prodErr;

    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        return res.status(400).json({ error: `ID ${item.product_id} ürünü bulunamadı` });
      }
      if (product.price == null || product.price < 0) {
        return res.status(400).json({ error: `Ürün fiyatsız veya negatif: ID ${product.id}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stok yetersiz: ${product.stock} adet kaldı (ID: ${product.id})` });
      }
    }

    // 3. Sipariş kalemlerini oluştur
    const orderItems = items.map(i => {
      const product = products.find(p => p.id === i.product_id);
      return {
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: product.price
      };
    });

    const totalWithoutDiscount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    // 4. Sepette kupon varsa indirimi hesapla
    let discount = 0;
    const { data: cartData, error: cartErr } = await supabase
      .from("cart")
      .select("coupon_code")
      .eq("user_id", userId)
      .maybeSingle();
    if (cartErr) throw cartErr;

    if (cartData?.coupon_code) {
      const { data: campaign, error: campErr } = await supabase
        .from("campaigns")
        .select("discount_percent")
        .eq("code", cartData.coupon_code)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .eq("is_active", true)
        .maybeSingle();
      if (campErr) throw campErr;

      if (campaign?.discount_percent > 0) {
        discount = totalWithoutDiscount * (campaign.discount_percent / 100);
      }
    }

    const total_amount = parseFloat((totalWithoutDiscount - discount).toFixed(2));

    // 5. Siparişi kaydet
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert([{ user_id: userId, total_amount, status: "pending" }])
      .select()
      .single();
    if (orderErr) throw orderErr;

    await supabaseAdmin
      .from("order_items")
      .insert(orderItems.map(it => ({ order_id: order.id, ...it })));

    // 6. Stokları düşür
    for (const it of items) {
      const { data: current } = await supabase
        .from("crud")
        .select("stock")
        .eq("id", it.product_id)
        .single();

      if (current.stock < it.quantity) {
        return res.status(400).json({
          error: `İşlem sırasında stok tükendi (ID: ${it.product_id})`
        });
      }

      await supabaseAdmin
        .from("crud")
        .update({ stock: current.stock - it.quantity })
        .eq("id", it.product_id);
    }

    // 7. Sepeti temizle
    await supabaseAdmin
      .from("cart")
      .delete()
      .eq("user_id", userId);

    // 8. E-posta gönder
    sendMail({
      to: userEmail,
      subject: "Siparişiniz Alındı",
      text: `Sipariş (ID: ${order.id}) alındı. Toplam: ${total_amount} TL`,
      html: `<p>Sipariş ID: <strong>${order.id}</strong><br/>Toplam: ${total_amount} TL</p>`
    }).catch(err => console.error("E-posta hatası:", err));

    return res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
}



// Kendi siparişlerini getir
async function getMyOrders(req, res) {
  const userId = req.user.id;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Geçersiz kullanıcı" });
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("orders")
      .select(`id, total_amount, status, created_at, order_items(*)`, { count: "exact" })
      .eq("user_id", userId);

    if (status) query = query.eq("status", status);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    return res.status(200).json({ page, limit, total: count, data });
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Sipariş detayı
async function getOrderById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Geçersiz sipariş ID" });

  try {
    // 1. Siparişi ve içindeki order_items'ları al
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`id, user_id, total_amount, status, created_at, order_items(*)`)
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    // 2. İlgili tüm ürün bilgilerini topla
    const productIds = order.order_items.map(item => item.product_id);
    const { data: products, error: productError } = await supabase
      .from("crud")
      .select("id, name, price, image_url")
      .in("id", productIds);

    if (productError) throw productError;

    // 3. Her sipariş kalemine ürün detaylarını ekle
    order.order_items = order.order_items.map(item => {
      const matchedProduct = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product: matchedProduct || null
      };
    });

    return res.status(200).json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function getAllOrders(req, res) {
  try {
    // 1. Siparişleri ve order_items'ları çek
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, total_amount, status, created_at, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 2. Tüm order_items'lardan product_id'leri topla
    const allItems = orders.flatMap(order => order.order_items);
    const productIds = [...new Set(allItems.map(item => item.product_id))];

    // 3. Ürün bilgilerini al
    const { data: products, error: prodErr } = await supabase
      .from("crud")
      .select("id, name, price, image_url")
      .in("id", productIds);

    if (prodErr) throw prodErr;

    // 4. Her siparişteki her item’a ürün bilgisi ekle
    const ordersWithProductDetails = orders.map(order => ({
      ...order,
      order_items: order.order_items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product: product || null
        };
      })
    }));

    return res.status(200).json(ordersWithProductDetails);
  } catch (err) {
    console.error("getAllOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
}


// Sipariş durumu güncelle
async function updateOrderStatus(req, res) {
  const orderId = Number(req.params.id);
  const { status } = req.body;
  if (isNaN(orderId) || typeof status !== "string") {
    return res.status(400).json({ error: "Geçersiz parametre" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();
    if (error) return res.status(404).json({ error: "Güncelleme başarısız" });

    return res.status(200).json(data);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Siparişi iptal et
async function cancelOrder(req, res) {
  const orderId = Number(req.params.id);
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Geçersiz kullanıcı" });
  }

  try {
    const { data: order, error: ordErr } = await supabase
      .from("orders")
      .select("user_id, status")
      .eq("id", orderId)
      .single();
    if (ordErr || !order) return res.status(404).json({ error: "Sipariş bulunamadı" });
    if (!isAdmin && order.user_id !== userId) return res.status(403).json({ error: "Yetkiniz yok" });
    if (!["pending", "paid"].includes(order.status)) {
      return res.status(400).json({ error: `İptal uygun değil: ${order.status}` });
    }

    const { data: cancelled, error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .select()
      .single();
    if (updErr) throw updErr;

    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    await Promise.all(
      items.map(async it => {
        const { data: prod } = await supabase
          .from("crud")
          .select("stock")
          .eq("id", it.product_id)
          .single();
        return supabaseAdmin
          .from("crud")
          .update({ stock: prod.stock + it.quantity })
          .eq("id", it.product_id);
      })
    );

    return res.status(200).json({ message: "İptal edildi", order: cancelled });
  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};
