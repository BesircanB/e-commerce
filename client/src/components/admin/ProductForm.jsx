import React, { useState } from "react";
import { useCategories } from "../../context/CategoryContext"; // ✅ context eklendi

const ProductForm = ({ onAdd }) => {
  const { categories } = useCategories(); // ✅ context kullanıldı

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category_id: "",
    stock: 10,
    visible: true,
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
    if (!form.name || !form.price) return;

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      image: form.image,
      description: form.description,
      category_id: Number(form.category_id),
      stock: Number(form.stock),
      visible: form.visible,
    };

    onAdd(payload);

    setForm({
      name: "",
      price: "",
      image: "",
      description: "",
      category_id: "",
      stock: 10,
      visible: true,
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
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ürün Adı"
        required
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Fiyat"
        type="number"
        required
      />
      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Görsel URL"
      />
      <input
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stok"
        type="number"
        min="0"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Açıklama"
      />

      {/* ✅ Kategori Seçimi */}
      <select
        name="category_id"
        value={form.category_id}
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
