import React from "react";
import { useCategories } from "../../context/CategoryContext";
import "./ProductInfoCard.css";

const ProductInfoCard = ({ product, hasPurchased, selectedVariant }) => {
  const { categories } = useCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? category.name : "—";

  return (
    <div className="product-info-card">
      <h1 className="product-info-title">{product.name}</h1>
      <div className="product-info-category">Kategori: <span>{categoryName}</span></div>
      <div className="product-info-desc">{product.description || "Ürün açıklaması mevcut değil."}</div>
      <div className="product-info-price-row">
        <span className="product-info-price">{product.price.toFixed(2)} ₺</span>
        {selectedVariant && (
          <span className={`product-info-stock ${selectedVariant.stock <= 0 ? "out" : "in"}`}>
            {selectedVariant.stock <= 0 ? "Tükendi" : `Stok: ${selectedVariant.stock}`}
          </span>
        )}
      </div>
      {hasPurchased && (
        <div className="product-info-purchased">Bu ürünü daha önce satın aldınız.</div>
      )}
    </div>
  );
};

export default ProductInfoCard;
