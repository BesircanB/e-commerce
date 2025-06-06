import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useCategories } from "../../context/CategoryContext"; // ✅ eklendi

const EditProductModal = ({ product, onSave, onClose }) => {
  const { categories } = useCategories(); // ✅ kategori listesi context'ten
  const [formData, setFormData] = useState({ ...product });

  useEffect(() => {
    setFormData({ ...product });
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_id: Number(formData.category_id),
    });
  };

  return (
    <Modal onClose={onClose}>
      <h2>Ürünü Düzenle</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ürün Adı"
          required
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Fiyat"
          type="number"
          required
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Görsel URL"
        />
        <input
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stok"
          type="number"
          min="0"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Açıklama"
        />

        {/* ✅ Kategori seçimi dropdown */}
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Kategori Seç</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleChange}
          />
          Kullanıcıya Göster
        </label>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button type="submit">Kaydet</button>
          <button type="button" onClick={onClose}>İptal</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
