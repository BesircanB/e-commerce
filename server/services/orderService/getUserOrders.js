const supabase = require("../supabase");

async function getUserOrders(userId) {
  const { data: orders, error } = await supabase
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
        products (
          id,
          name,
          price,
          image
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Siparişler alınamadı");
  }

  return orders || [];
}

module.exports = getUserOrders;
