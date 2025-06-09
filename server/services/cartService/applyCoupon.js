const supabase = require("../supabase");

async function applyCoupon({ userId, couponCode }) {
  if (!userId || !couponCode) {
    throw new Error("Kullanıcı ID ve kupon kodu gereklidir");
  }

  // 1. Kupon var mı kontrol et
  const { data: coupon, error: couponError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("code", couponCode)
    .eq("is_active", true)
    .single();

  if (couponError || !coupon) {
    throw new Error("Geçersiz veya pasif kupon kodu");
  }

  // 2. Kullanıcının sepetine kuponu uygula
  const { error: updateError } = await supabase
    .from("cart")
    .update({ coupon_code: couponCode })
    .eq("user_id", userId);

  if (updateError) {
    throw new Error("Kupon uygulanamadı");
  }

  return { message: "Kupon başarıyla uygulandı" };
}

module.exports = applyCoupon;
