import React from "react";
import { useCategories } from "../../context/CategoryContext";

const ProductInfoCard = ({ product, hasPurchased }) => {
  const { categories } = useCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? category.name : "—";

  return (
    <div>
      <h2>{product.name}</h2>
      <p><strong>Kategori:</strong> {categoryName}</p>
      <p>{product.description || "Ürün açıklaması mevcut değil."}</p>
      <h3>{product.price.toFixed(2)} ₺</h3>

      {product.stock <= 0 ? (
        <p style={{ color: "red", fontWeight: "bold" }}>Tükendi</p>
      ) : (
        <p><strong>Stok:</strong> {product.stock}</p>
      )}

      {hasPurchased && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "0.5rem" }}>
          Bu ürünü daha önce satın aldınız.
        </p>
      )}
    </div>
  );
};

export default ProductInfoCard;
