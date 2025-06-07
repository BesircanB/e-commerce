import React, { useState } from "react";
import { useCampaigns } from "../../context/CampaignContext";
import { useCategories } from "../../context/CategoryContext";

const CampaignForm = () => {
  const { addCampaign } = useCampaigns();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    name: "",
    discount_percent: "",
    min_order_price: "",
    category_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "discount_percent" || name === "min_order_price"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.discount_percent || !form.category_id) {
      alert("Zorunlu alanları doldurun");
      return;
    }

    await addCampaign(form);
    setForm({
      name: "",
      discount_percent: "",
      min_order_price: "",
      category_id: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Yeni Kampanya Ekle</h3>
      <input
        type="text"
        name="name"
        placeholder="Kampanya Adı"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="discount_percent"
        placeholder="İndirim (%)"
        value={form.discount_percent}
        onChange={handleChange}
      />
      <input
        type="number"
        name="min_order_price"
        placeholder="Minimum Sipariş Tutarı (₺)"
        value={form.min_order_price}
        onChange={handleChange}
      />
      <select name="category_id" value={form.category_id} onChange={handleChange}>
        <option value="">Kategori Seç</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit">Ekle</button>
    </form>
  );
};

const formStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

export default CampaignForm;
