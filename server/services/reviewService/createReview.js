const supabase = require("../supabase");
const {
  validateRating,
  cleanComment,
} = require("../../utils/reviewHelpers");

async function createReview(userId, productId, { rating, comment, photo_url }) {
  if (!productId || isNaN(productId)) {
    throw new Error("Geçersiz ürün ID");
  }

  const trimmedComment = cleanComment(comment);

  if (trimmedComment && !validateRating(rating)) {
    throw new Error("Yorum için geçerli yıldız puanı gerekir (1-5)");
  }

  // Aynı kullanıcı daha önce yorum yaptı mı?
  const { data: existing, error: checkErr } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (checkErr) throw checkErr;
  if (existing) {
    throw new Error("Bu ürüne zaten yorum yaptınız");
  }

  // Kullanıcı gerçekten sipariş etmiş mi?
  const { data: validOrders, error: orderErr } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .neq("status", "cancelled");

  if (orderErr) throw orderErr;
  const orderIds = validOrders.map((o) => o.id);

  const { data: orderedItems, error: itemErr } = await supabase
    .from("order_items")
    .select("product_id")
    .in("order_id", orderIds)
    .eq("product_id", productId);

  if (itemErr) throw itemErr;
  if (!orderedItems || orderedItems.length === 0) {
    throw new Error("Bu ürünü satın almadığınız için yorum yapamazsınız");
  }

  const insertData = {
    user_id: userId,
    product_id: productId,
    rating,
    comment: trimmedComment,
    photo_url,
  };

  const { data, error: insertErr } = await supabase
    .from("reviews")
    .insert([insertData])
    .select();

  if (insertErr) throw insertErr;

  return data[0];
}

module.exports = createReview;
