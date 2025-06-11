const campaignService = require("../services/campaignService");

// ✅ Yeni kampanya oluştur
async function createCampaign(req, res) {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Tüm kampanyaları getir (opsiyonel olarak sadece aktif olanlar)
async function getAllCampaigns(req, res) {
  try {
    const onlyActive = req.query.onlyActive === "true";
    // Sıralama parametreleri opsiyonel olarak query'den alınabilir
    const orderBy = req.query.orderBy || "start_date";
    const ascending = req.query.ascending === "true";
    const tagId = req.query.tagId ? Number(req.query.tagId) : undefined;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const campaigns = await campaignService.getAllCampaigns({ onlyActive, orderBy, ascending, tagId, categoryId });
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Kupon koduna göre kampanya getir
async function getCampaignByCode(req, res) {
  try {
    const campaign = await campaignService.getCampaignByCode(req.params.code);
    res.status(200).json(campaign);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// ✅ Kampanyayı güncelle
async function updateCampaign(req, res) {
  try {
    const updated = await campaignService.updateCampaign(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kampanyanın aktifliğini güncelle (toggle)
async function toggleCampaignStatus(req, res) {
  try {
    const { is_active } = req.body;
    const updated = await campaignService.toggleCampaignStatus(req.params.id, is_active);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Kampanyayı sil
async function deleteCampaign(req, res) {
  try {
    const result = await campaignService.deleteCampaign(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignByCode,
  updateCampaign,
  toggleCampaignStatus,
  deleteCampaign,
};
