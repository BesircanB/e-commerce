const supabase = require("../supabase");
const { sendMail } = require("../emailService");
const { calculateTotal, extractCouponCode } = require("../../utils/orderHelpers");
const { validateStock, decreaseStock } = require("../../utils/stockHelpers");
const { getOrderConfirmationText, getOrderConfirmationHtml } = require("../../utils/mailTemplates");

async function createOrder(userId) {
  const { data: cartItems, error } = await supabase
    .from("cart")
    .select("id, product_id, quantity, coupon_code, products(*)")
    .eq("user_id", userId);

  if (error || !cartItems || cartItems.length === 0) {
    throw new Error("Sepet boş veya alınamadı");
  }

  await validateStock(cartItems);

  const couponCode = extractCouponCode(cartItems);
  const { total, discount, finalTotal } = calculateTotal(cartItems);

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert([{ user_id: userId, total, discount, final_total: finalTotal, status: "pending" }])
    .select()
    .single();

  if (orderErr) throw new Error("Sipariş oluşturulamadı");

  const itemsPayload = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.products?.price || 0,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsErr) throw new Error("Ürünler eklenemedi");

  await decreaseStock(cartItems);

  if (couponCode) {
    await supabase.from("campaigns").update({ is_active: false }).eq("code", couponCode);
  }

  await supabase.from("cart").delete().eq("user_id", userId);

  const { data: user } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", userId)
    .single();

  if (user?.email) {
    await sendMail({
      to: user.email,
      subject: "Siparişiniz Alındı",
      text: getOrderConfirmationText(order, user),
      html: getOrderConfirmationHtml(order, user),
    });
  }

  return { message: "Sipariş başarıyla oluşturuldu", order };
}

module.exports = createOrder;
