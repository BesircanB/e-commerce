const supabase = require("../supabase");

async function updateOrderStatus(orderId, newStatus) {
  if (!orderId || !newStatus) {
    throw new Error("Sipariş ID veya yeni durum eksik");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Sipariş durumu güncellenemedi");
  }

  return {
    message: "Sipariş durumu güncellendi",
    order: data,
  };
}

module.exports = updateOrderStatus;
