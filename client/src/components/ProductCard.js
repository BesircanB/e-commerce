import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card">
      {/* ❤️ Favori Butonu sadece giriş yapmış user için görünür */}
      {user && user.role !== "admin" && (
        <div
          className="wishlist-icon"
          onClick={handleWishlistToggle}
          title="Favorilere ekle/kaldır"
        >
          {isInWishlist(product.id) ? "❤️" : "🤍"}
        </div>
      )}

      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.price.toFixed(2)} ₺</p>
      </Link>

      <button onClick={() => addToCart(product.id)}>Sepete Ekle</button>
    </div>
  );
};

export default ProductCard;
