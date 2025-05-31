import React, { useState, useEffect } from "react";

const EditProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(product);

  useEffect(() => {
    setForm(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updated = {
      ...form,
      price: parseFloat(form.price), // 🔥 price artık her zaman sayı olacak
    };

    onSave(updated);
    onClose();
  };

  if (!product) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        width: "400px"
      }}>
        <h3>Ürünü Düzenle</h3>

        <input name="title" value={form.title} onChange={handleChange} placeholder="Ürün Adı" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Fiyat" type="number" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Görsel URL" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" />

        <select name="category" value={form.category} onChange={handleChange}>
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

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit">Kaydet</button>
          <button type="button" onClick={onClose}>İptal</button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;
