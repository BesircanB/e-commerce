// src/pages/ProductDetailPage.js
import React from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../models/mockProducts";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id.toString() === id);
  const { addToCart } = useCart();

  if (!product) return (
    <div>
      <Header />
      <p style={{ padding: "2rem" }}>Ürün bulunamadı.</p>
    </div>
  );

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "300px", borderRadius: "8px" }}
        />
        <div>
          <h2>{product.title}</h2>
          <p>{product.description || "Ürün açıklaması mevcut değil."}</p>
          <h3>{product.price.toFixed(2)} ₺</h3>
          <button onClick={() => addToCart(product)}>Sepete Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
