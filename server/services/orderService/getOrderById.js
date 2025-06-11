const { supabaseAdmin } = require("../supabase");

async function getOrderById(orderId, userId, isAdmin = false) {
  if (!orderId || !userId) throw new Error("Eksik parametre");

  const query = supabaseAdmin
    .from("orders")
    .select(`
      id,
      created_at,
      total,
      discount,
      final_total,
      status,
      user_id,
      order_items (
        id,
        quantity,
        unit_price,
        crud (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (!isAdmin) {
    query.eq("user_id", userId); // sadece kendi siparişi
  }

  const { data: order, error } = await query;

  if (error || !order) {
    throw new Error("Sipariş bulunamadı");
  }

  return order;
}

module.exports = getOrderById;
