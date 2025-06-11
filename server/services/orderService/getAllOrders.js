const {supabaseAdmin} = require("../supabase");

async function getAllOrders() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      created_at,
      total,
      discount,
      final_total,
      status,
      users (
        id,
        name,
        email
      ),
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
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Tüm siparişler alınamadı");
  }

  return orders || [];
}

module.exports = getAllOrders;
