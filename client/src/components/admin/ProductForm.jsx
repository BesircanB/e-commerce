import React, { useState } from "react";

const ProductForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "Giyim", // ✅ varsayılan kategori
    visible: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return;
    onAdd(form);
    setForm({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "Giyim",
      visible: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}
    >
      <input name="name" value={form.name} onChange={handleChange} placeholder="Ürün Adı" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Fiyat" type="number" required />
      <input name="image" value={form.image} onChange={handleChange} placeholder="Görsel URL" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" />

      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="Giyim">Giyim</option>
        <option value="Ayakkabı">Ayakkabı</option>
        <option value="Elektronik">Elektronik</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="visible"
          checked={form.visible}
          onChange={handleChange}
        />
        Kayıtlı kullanıcıya göster
      </label>

      <button type="submit">Ekle</button>
    </form>
  );
};

export default ProductForm;
