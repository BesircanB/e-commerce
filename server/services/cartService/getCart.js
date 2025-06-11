const { supabaseAdmin } = require("../supabase");
const { calculateCartTotal } = require("../../utils/cartHelpers");
const { getAllCampaigns } = require("../campaignService");

async function getCart(userId) {
  if (!userId) {
    throw new Error("Kullanıcı ID'si gerekli");
  }

  try {
    const { data: cartItems, error } = await supabaseAdmin
      .from("cart")
      .select(`
        id,
        quantity,
        coupon_code,
        product_id,
        crud (
          id,
          name,
          description,
          price,
          image_url,
          stock,
          is_visible,
          category_id
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Sepet getirme hatası:", error);
      throw new Error("Sepet alınırken bir hata oluştu");
    }

    // cartItems boş olabilir — bu hata değildir
    let result = calculateCartTotal(cartItems || []);
    let appliedAutoCampaign = null;
    let appliedCouponCampaign = null;
    let couponDiscount = 0;
    let autoDiscount = 0;

    // 1. Kupon kodu varsa, ilgili kampanyayı bul ve indirimi uygula
    const couponCodes = [...new Set((cartItems || []).map(item => item.coupon_code).filter(Boolean))];
    if (couponCodes.length > 0) {
      // Sepetteki ilk kupon kodunu uygula (çoklu kupon desteği yoksa)
      const couponCode = couponCodes[0];
      const { data: couponCampaign } = await supabaseAdmin
        .from("campaigns")
        .select("*")
        .eq("code", couponCode)
        .eq("is_active", true)
        .single();
      if (couponCampaign) {
        appliedCouponCampaign = couponCampaign;
        if (couponCampaign.discount_type === "percentage") {
          couponDiscount = result.total * (couponCampaign.discount_value / 100);
        } else if (couponCampaign.discount_type === "amount") {
          couponDiscount = couponCampaign.discount_value;
        }
      }
    }

    // 2. Auto campaign uygula (her zaman kontrol et)
    if (cartItems && cartItems.length > 0) {
      const productCategoryIds = [...new Set(cartItems.map(item => item.crud?.category_id).filter(Boolean))];
      const autoCampaigns = await getAllCampaigns({ onlyActive: true, applyType: "auto" });
      for (const camp of autoCampaigns) {
        const { id: campaignId } = camp;
        const { data: campCats } = await supabaseAdmin
          .from("campaign_categories")
          .select("category_id")
          .eq("campaign_id", campaignId);
        const campaignCategoryIds = campCats ? campCats.map(row => row.category_id) : [];
        const categoryMatch = campaignCategoryIds.length === 0 || productCategoryIds.some(catId => campaignCategoryIds.includes(catId));
        const minOrderOk = result.total >= (camp.min_order_amount || 0);
        if (categoryMatch && minOrderOk) {
          if (camp.discount_type === "percentage") {
            autoDiscount = result.total * (camp.discount_value / 100);
          } else if (camp.discount_type === "amount") {
            autoDiscount = camp.discount_value;
          }
          appliedAutoCampaign = camp;
          break;
        }
      }
    }

    // Toplam indirim ve final total hesapla
    const totalDiscount = couponDiscount + autoDiscount;
    const finalTotal = result.total - totalDiscount;

    return {
      items: cartItems || [],
      ...result,
      couponDiscount,
      autoDiscount,
      totalDiscount,
      finalTotal,
      appliedCouponCampaign,
      appliedAutoCampaign
    };
  } catch (error) {
    console.error("getCart servis hatası:", error);
    throw new Error("Sepet işlemi sırasında bir hata oluştu");
  }
}

module.exports = getCart;
