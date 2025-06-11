const {supabaseAdmin} = require("../supabase");

async function applyCoupon({ userId, couponCode }) {
  if (!userId || !couponCode) {
    throw new Error("Kullanıcı ID ve kupon kodu gereklidir");
  }

  const trimmedUserId = userId.trim();
  console.log("applyCoupon gelen userId:", '|' + trimmedUserId + '|');

  // Önce cart tablosunda bu user_id ile satır var mı kontrol et
  const { data: cartRows, error: cartError } = await supabaseAdmin
    .from("cart")
    .select("id, user_id, coupon_code, product_id")
    .eq("user_id", trimmedUserId);
  console.log("Cart tablosunda bulunan satırlar:", cartRows, cartError);

  // 1. Kupon var mı kontrol et
  const { data: coupon, error: couponError } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .eq("code", couponCode)
    .eq("is_active", true)
    .single();

  if (couponError || !coupon) {
    throw new Error("Geçersiz veya pasif kupon kodu");
  }

  // 2. Kullanıcının sepetine kuponu uygula
  const { data: updatedRows, error: updateError } = await supabaseAdmin
    .from("cart")
    .update({ coupon_code: couponCode })
    .eq("user_id", trimmedUserId)
    .select();

  console.log("Kupon update sonucu:", updatedRows, updateError);

  if (updateError) {
    throw new Error("Kupon uygulanamadı");
  }

  return { message: "Kupon başarıyla uygulandı" };
}

module.exports = applyCoupon;
