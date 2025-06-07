import React from "react";
import { useCategories } from "../../context/CategoryContext";

const ProductFormFields = ({ product, onChange }) => {
  const { categories } = useCategories();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <input
        type="text"
        name="name"
        placeholder="Ürün Adı"
        value={product.name}
        onChange={onChange}
      />
      <textarea
        name="description"
        placeholder="Açıklama"
        value={product.description}
        onChange={onChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Fiyat (₺)"
        value={product.price}
        onChange={onChange}
      />
      <input
        type="number"
        name="stock"
        placeholder="Stok"
        value={product.stock}
        onChange={onChange}
      />
      <input
        type="text"
        name="image_url"
        placeholder="Görsel URL"
        value={product.image_url}
        onChange={onChange}
      />
      <select name="category_id" value={product.category_id} onChange={onChange}>
        <option value="">Kategori Seç</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFormFields;
