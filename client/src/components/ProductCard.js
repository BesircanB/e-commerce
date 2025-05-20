import React from "react";
import { useCart } from "../context/CartContext"; // ✅ Sepet işlemi için
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // ✅ Sepete ekle fonksiyonu

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.price} ₺</p>
      <button onClick={() => addToCart(product)}>Sepete Ekle</button>
    </div>
  );
};

export default ProductCard;
