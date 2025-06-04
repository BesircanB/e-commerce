// server/controllers/campaignController.js

const supabase = require("../services/supabase");

// ✅ PUBLIC: Aktif kampanyaları getir
const getActiveCampaigns = async (req, res) => {
  try {
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .lte("start_date", today)
      .gte("end_date", today)
      .eq("is_active", true);

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("getActiveCampaigns error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ ADMIN: Tüm kampanyaları getir
const getAllCampaigns = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error("getAllCampaigns error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ ADMIN: Yeni kampanya oluştur

const createCampaign = async (req, res) => {
  const {
    title,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    start_date,
    end_date,
    is_active,
    code,
    apply_type
  } = req.body;

  if (!title || !discount_type || discount_value == null || !apply_type) {
    return res.status(400).json({ error: "Zorunlu alanlar eksik" });
  }

  // Eğer apply_type "code" ise, code zorunlu ve benzersiz olmalı
  if (apply_type === "code") {
    if (!code) {
      return res.status(400).json({ error: "Kupon kodu zorunludur" });
    }

    const { data: existing, error: checkErr } = await supabase
      .from("campaigns")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (checkErr) throw checkErr;
    if (existing) {
      return res.status(409).json({ error: "Bu kupon kodu zaten mevcut" });
    }
  }

  const insertData = {
    title,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    start_date,
    end_date,
    is_active,
    code: apply_type === "code" ? code : null,
    apply_type
  };

  try {
    const { data, error } = await supabase
      .from("campaigns")
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (err) {
    console.error("createCampaign error:", err);
    return res.status(500).json({ error: err.message });
  }
};


// ✅ ADMIN: Kampanya güncelle
const updateCampaign = async (req, res) => {
  const id = Number(req.params.id);
  const updateFields = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Geçersiz kampanya ID" });
  }

  try {
    const { data, error } = await supabase
      .from("campaigns")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("updateCampaign error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ ADMIN: Kampanya sil
const deleteCampaign = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Geçersiz kampanya ID" });
  }

  try {
    const { data, error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Kampanya bulunamadı" });
    }

    return res.json({ message: "Kampanya silindi", deleted: data });
  } catch (err) {
    console.error("deleteCampaign error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getActiveCampaigns,
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
};
