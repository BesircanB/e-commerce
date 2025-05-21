import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      {/* Ürün detay sayfasına yönlendirme */}
      <Link to={`/product/${product.id}`} className="product-link">
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
      </Link>

      <p>{product.price} ₺</p>
      <button onClick={() => addToCart(product)}>Sepete Ekle</button>
    </div>
  );
};

export default ProductCard;
