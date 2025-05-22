import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card">
      {/* ❤️ Favori Butonu */}
      <div
        className="wishlist-icon"
        onClick={handleWishlistToggle}
        title="Favorilere ekle/kaldır"
      >
        {isInWishlist(product.id) ? "❤️" : "🤍"}
      </div>

      {/* 🛍️ Detay sayfasına yönlendirme */}
      <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
        <p>{product.price.toFixed(2)} ₺</p>
      </Link>

      <button onClick={() => addToCart(product)}>Sepete Ekle</button>
    </div>
  );
};

export default ProductCard;
