import React, { useEffect, useState } from "react";
import { useCampaigns } from "../context/CampaignContext";
import Header from "../components/Header";
import axios from "../services/axiosInstance";
import { useCategories } from "../context/CategoryContext"; // ✅

const AdminCampaigns = () => {
  const {
    campaigns,
    createCampaign,
    deleteCampaign,
    updateCampaign,
  } = useCampaigns();

  const { categories } = useCategories(); // ✅

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    code: "",
    discount_percent: "",
    is_active: true,
    discount_type: "percentage",
    apply_type: "all_products",
    selected_product_ids: [],
    selected_category_ids: [], // ✅
    min_order_amount: "",
    start_date: "",
    end_date: "",
  });

  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products/admin/all");
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (name === "selected_product_ids" || name === "selected_category_ids") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => Number(opt.value));
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : name === "discount_percent" || name === "min_order_amount"
            ? Number(value) || 0
            : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || formData.discount_percent <= 0) return;

    const payload = { ...formData };

    if (payload.apply_type !== "selected_products") {
      delete payload.selected_product_ids;
    }

    if (payload.selected_category_ids?.length > 0) {
      payload.category_ids = payload.selected_category_ids;
    }

    delete payload.selected_category_ids;

    if (isEditing) {
      updateCampaign(editingId, payload);
    } else {
      createCampaign(payload);
    }

    resetForm();
  };

  const handleEditClick = (c) => {
    setFormData({
      code: c.code,
      discount_percent: c.discount_percent,
      is_active: c.is_active,
      discount_type: c.discount_type || "percentage",
      apply_type: c.apply_type || "all_products",
      selected_product_ids: c.selected_product_ids || [],
      selected_category_ids: c.category_ids || [], // ✅ backend ile eşleşmeli
      min_order_amount: c.min_order_amount || 0,
      start_date: c.start_date?.slice(0, 10) || "",
      end_date: c.end_date?.slice(0, 10) || "",
    });
    setEditingId(c.id);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_percent: "",
      is_active: true,
      discount_type: "percentage",
      apply_type: "all_products",
      selected_product_ids: [],
      selected_category_ids: [],
      min_order_amount: "",
      start_date: "",
      end_date: "",
    });
    setEditingId(null);
  };

  return (
    <>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>🎯 Kampanya Yönetimi</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Kod (örn: YAZ20)"
            required
            style={{ marginRight: "1rem" }}
          />
          <input
            type="number"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleChange}
            placeholder="% İndirim / ₺ Tutar"
            required
            style={{ marginRight: "1rem" }}
          />

          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            style={{ marginRight: "1rem" }}
          >
            <option value="percentage">% Yüzde</option>
            <option value="fixed">₺ Sabit</option>
          </select>

          <select
            name="apply_type"
            value={formData.apply_type}
            onChange={handleChange}
            style={{ marginRight: "1rem" }}
          >
            <option value="all_products">Tüm Ürünler</option>
            <option value="selected_products">Seçili Ürünler</option>
          </select>

          <input
            type="number"
            name="min_order_amount"
            value={formData.min_order_amount}
            onChange={handleChange}
            placeholder="Min. Sipariş Tutarı"
            style={{ marginRight: "1rem" }}
          />

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            style={{ marginRight: "1rem" }}
          />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            style={{ marginRight: "1rem" }}
          />

          <label style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />{" "}
            Aktif
          </label>

          <button type="submit">{isEditing ? "💾 Güncelle" : "➕ Ekle"}</button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "1rem", color: "gray" }}
            >
              İptal
            </button>
          )}

          {/* Ürün Seçimi */}
          {formData.apply_type === "selected_products" && (
            <div style={{ marginTop: "1rem" }}>
              <label><strong>📦 Kampanyaya Dahil Ürünler:</strong></label>
              <select
                multiple
                name="selected_product_ids"
                value={formData.selected_product_ids}
                onChange={handleChange}
                style={{ width: "100%", height: "120px", marginTop: "0.5rem" }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ✅ Kategori Seçimi */}
          <div style={{ marginTop: "1rem" }}>
            <label><strong>📂 Kampanyaya Dahil Kategoriler:</strong></label>
            <select
              multiple
              name="selected_category_ids"
              value={formData.selected_category_ids}
              onChange={handleChange}
              style={{ width: "100%", height: "100px", marginTop: "0.5rem" }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Liste */}
        <ul>
          {campaigns.length === 0 && <p>Hiç kampanya bulunamadı.</p>}
          {campaigns.map((c) => (
            <li key={c.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{c.code}</strong> — %{c.discount_percent} {c.discount_type} —{" "}
              {c.apply_type}{" "}
              {c.min_order_amount ? `– ₺${c.min_order_amount}+` : ""}{" "}
              {c.start_date ? `📆 ${c.start_date?.slice(0, 10)}` : ""}{" "}
              {c.end_date ? `→ ${c.end_date?.slice(0, 10)}` : ""}{" "}
              {c.is_active ? "🟢 Aktif" : "🔴 Pasif"}{" "}
              <button
                onClick={() => handleEditClick(c)}
                style={{ marginLeft: "1rem", color: "blue" }}
              >
                Düzenle
              </button>
              <button
                onClick={() => deleteCampaign(c.id)}
                style={{ marginLeft: "0.5rem", color: "red" }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminCampaigns;
