const { supabaseAdmin } = require("../supabase");
const { calculateCartTotal } = require("../../utils/cartHelpers");
const { getAllCampaigns } = require("../campaignService");

async function getCart(userId) {
  if (!userId) {
    throw new Error("Kullanıcı ID gerekli");
  }

  const isGuest = userId.startsWith('guest_');
  
  if (isGuest) {
    return await getGuestCart(userId);
  } else {
    return await getUserCart(userId);
  }
}

async function getUserCart(userId) {
  // Kullanıcının sepet öğelerini al
  const { data: cartItems, error: cartError } = await supabaseAdmin
    .from("cart")
    .select(`
      id,
      quantity,
      created_at,
      crud:product_id (
        id,
        name,
        price,
        image_url,
        category_id,
        description,
        stock,
        is_visible
      )
    `)
    .eq("user_id", userId);

  if (cartError) {
    console.error("Sepet getirme hatası:", cartError);
    throw new Error("Sepet getirilemedi");
  }

  if (!cartItems || cartItems.length === 0) {
    return {
      items: [],
      total: 0,
      totalDiscount: 0,
      finalTotal: 0,
      appliedCouponCampaign: null,
      appliedAutoCampaign: null,
      couponDiscount: 0,
      autoDiscount: 0,
    };
  }

  // Stokta olmayan veya görünür olmayan ürünleri filtrele
  const validItems = cartItems.filter(item => 
    item.crud && 
    item.crud.is_visible && 
    item.crud.stock > 0
  );

  // Stokta olmayan ürünleri sepetten kaldır
  const invalidItems = cartItems.filter(item => 
    !item.crud || 
    !item.crud.is_visible || 
    item.crud.stock <= 0
  );

  for (const invalidItem of invalidItems) {
    await supabaseAdmin
      .from("cart")
      .delete()
      .eq("id", invalidItem.id);
  }

  // Toplam hesapla
  let total = 0;
  validItems.forEach(item => {
    total += (item.crud.price || 0) * item.quantity;
  });

  // Kampanya kontrolü
  const { data: userCampaigns, error: campaignError } = await supabaseAdmin
    .from("user_campaigns")
    .select(`
      id,
      coupon_code,
      campaign_id,
      campaigns (
        id,
        title,
        discount_type,
        discount_value,
        min_order_amount,
        is_active
      )
    `)
    .eq("user_id", userId)
    .eq("is_used", false);

  let couponDiscount = 0;
  let autoDiscount = 0;
  let appliedCouponCampaign = null;
  let appliedAutoCampaign = null;

  if (!campaignError && userCampaigns) {
    for (const userCampaign of userCampaigns) {
      const campaign = userCampaign.campaigns;
      
      if (!campaign || !campaign.is_active) continue;
      if (campaign.min_order_amount && total < campaign.min_order_amount) continue;

      if (userCampaign.coupon_code) {
        // Kupon kodu ile uygulanan kampanya
        if (campaign.discount_type === 'percentage') {
          couponDiscount = (total * campaign.discount_value) / 100;
        } else {
          couponDiscount = campaign.discount_value;
        }
        appliedCouponCampaign = {
          id: campaign.id,
          title: campaign.title,
          code: userCampaign.coupon_code
        };
      } else {
        // Otomatik kampanya
        if (campaign.discount_type === 'percentage') {
          autoDiscount = (total * campaign.discount_value) / 100;
        } else {
          autoDiscount = campaign.discount_value;
        }
        appliedAutoCampaign = {
          id: campaign.id,
          title: campaign.title
        };
      }
    }
  }

  const totalDiscount = couponDiscount + autoDiscount;
  const finalTotal = Math.max(0, total - totalDiscount);

  return {
    items: validItems,
    total,
    totalDiscount,
    finalTotal,
    appliedCouponCampaign,
    appliedAutoCampaign,
    couponDiscount,
    autoDiscount,
  };
}

async function getGuestCart(userId) {
  // Guest kullanıcının sepet öğelerini al
  const { data: cartItems, error: cartError } = await supabaseAdmin
    .from("session_carts")
    .select(`
      id,
      quantity,
      created_at,
      crud:product_id (
        id,
        name,
        price,
        image_url,
        category_id,
        description,
        stock,
        is_visible
      )
    `)
    .eq("session_id", userId);

  if (cartError) {
    console.error("Guest sepet getirme hatası:", cartError);
    throw new Error("Sepet getirilemedi");
  }

  if (!cartItems || cartItems.length === 0) {
    return {
      items: [],
      total: 0,
      totalDiscount: 0,
      finalTotal: 0,
      appliedCouponCampaign: null,
      appliedAutoCampaign: null,
      couponDiscount: 0,
      autoDiscount: 0,
    };
  }

  // Stokta olmayan veya görünür olmayan ürünleri filtrele
  const validItems = cartItems.filter(item => 
    item.crud && 
    item.crud.is_visible && 
    item.crud.stock > 0
  );

  // Stokta olmayan ürünleri sepetten kaldır
  const invalidItems = cartItems.filter(item => 
    !item.crud || 
    !item.crud.is_visible || 
    item.crud.stock <= 0
  );

  for (const invalidItem of invalidItems) {
    await supabaseAdmin
      .from("session_carts")
      .delete()
      .eq("id", invalidItem.id);
  }

  // Toplam hesapla (guest için kampanya yok)
  let total = 0;
  validItems.forEach(item => {
    total += (item.crud.price || 0) * item.quantity;
  });

  return {
    items: validItems,
    total,
    totalDiscount: 0,
    finalTotal: total,
    appliedCouponCampaign: null,
    appliedAutoCampaign: null,
    couponDiscount: 0,
    autoDiscount: 0,
  };
}

module.exports = getCart;
