const supabase = require("../supabase");

/**
 * Kampanyaları getirir.
 * @param {Object} options
 * @param {boolean} options.onlyActive - Sadece aktif ve geçerli kampanyalar gelsin mi?
 * @param {string} [options.orderBy="start_date"] - Sıralama yapılacak alan
 * @param {boolean} [options.ascending=false] - Artan mı azalan mı?
 * @param {number} [options.tagId] - Belirli bir etikete sahip kampanyalar
 * @param {number} [options.categoryId] - Belirli bir kategoriye sahip kampanyalar
 * @param {string} [options.applyType] - Kampanya uygulama tipi (auto/code)
 */
async function getAllCampaigns({ onlyActive = false, orderBy = "start_date", ascending = false, tagId, categoryId, applyType } = {}) {
  let query;

  if (tagId && categoryId) {
    // Hem tag hem kategori join
    query = supabase
      .from("campaigns")
      .select("*, campaign_tags:campaign_tags!inner(tag_id), campaign_categories:campaign_categories!inner(category_id)")
      .eq("campaign_tags.tag_id", tagId)
      .eq("campaign_categories.category_id", categoryId);
  } else if (tagId) {
    // Sadece tag join
    query = supabase
      .from("campaigns")
      .select("*, campaign_tags:campaign_tags!inner(tag_id)")
      .eq("campaign_tags.tag_id", tagId);
  } else if (categoryId) {
    // Sadece kategori join
    query = supabase
      .from("campaigns")
      .select("*, campaign_categories:campaign_categories!inner(category_id)")
      .eq("campaign_categories.category_id", categoryId);
  } else {
    query = supabase.from("campaigns").select("*");
  }

  if (onlyActive) {
    const now = new Date().toISOString();
    query = query
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now);
  }

  if (applyType) {
    query = query.eq("apply_type", applyType);
  }

  const { data: campaigns, error } = await query.order(orderBy, {
    ascending,
  });

  if (error) {
    console.error("Supabase error in getAllCampaigns:", error);
    throw new Error("Kampanyalar getirilemedi");
  }

  // Join ile geldiyse, campaign_tags ve campaign_categories içindeki id'leri istemiyoruz
  if (Array.isArray(campaigns)) {
    return campaigns.map(camp => {
      if (camp.campaign_tags) delete camp.campaign_tags;
      if (camp.campaign_categories) delete camp.campaign_categories;
      return camp;
    });
  }
  return campaigns;
}

module.exports = getAllCampaigns;
