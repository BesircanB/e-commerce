const { supabaseAdmin } = require("../supabase");
const { restoreStock } = require("../../utils/stockHelpers");

async function cancelOrder(orderId, userId, isAdmin = false) {
  if (!orderId || !userId) {
    throw new Error("Sipariş ID veya kullanıcı ID eksik");
  }

  const { data: order, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("id, user_id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    throw new Error("Sipariş bulunamadı");
  }

  if (!isAdmin && order.user_id !== userId) {
    throw new Error("Bu siparişi iptal etme yetkiniz yok");
  }

  if (order.status === "cancelled") {
    return { message: "Sipariş zaten iptal edilmiş" };
  }

  // order_items içinden ürünleri al
  const { data: items, error: itemErr } = await supabaseAdmin
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (itemErr || !items) {
    throw new Error("Sipariş ürünleri alınamadı");
  }

  // Stokları geri yükle (utils içinden)
  await restoreStock(items);

  // Kupon varsa aktif hale getir
  const { data: couponCart } = await supabaseAdmin
    .from("cart")
    .select("coupon_code")
    .eq("user_id", userId)
    .maybeSingle();

  if (couponCart?.coupon_code) {
    await supabaseAdmin
      .from("campaigns")
      .update({ is_active: true })
      .eq("code", couponCart.coupon_code);
  }

  // Siparişi iptal et
  const { error: cancelErr } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (cancelErr) {
    throw new Error("Sipariş iptal edilemedi");
  }

  return { message: "Sipariş iptal edildi" };
}

module.exports = cancelOrder;
