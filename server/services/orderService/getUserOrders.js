const { supabaseAdmin } = require("../supabase");

async function getUserOrders(userId) {
  console.log("getUserOrders ÇAĞRILDI", userId);

  // Sadeleştirilmiş sorgu ile veri geliyor mu kontrol et
  const { data: ordersSimple, error: errorSimple } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", userId);
  console.log("getUserOrders (sade):", ordersSimple, errorSimple);

  // Doğru ilişkili sorgu
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      created_at,
      total,
      discount,
      final_total,
      status,
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  console.log("getUserOrders (ilişkili):", orders, error);

  if (error) {
    throw new Error("Siparişler alınamadı");
  }

  return orders || [];
}

module.exports = getUserOrders;
