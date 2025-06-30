// components/ProductCard/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCategories } from "../../context/CategoryContext";
import { FiEdit2, FiEye, FiEyeOff, FiTrash2, FiTag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";

import WishlistIcon from "./WishlistIcon";
import AdminCardControls from "./AdminCardControls";

const ProductCard = ({ product, onEdit, onDelete, onToggleVisibility }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { categories } = useCategories();

  const isAdmin = user?.role === "admin";
  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? category.name : "—";

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="star-icon half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon empty" />);
      }
    }
    return stars;
  };

  return (
    <div className={`product-card wishlist-product-card${isAdmin ? " admin-product-card" : ""}`}>
      {!isAdmin && user && <WishlistIcon product={product} />}
      <Link
        to={`/product/${product.id}`}
        className="wishlist-product-link"
      >
        <img src={product.image || product.image_url} alt={product.name} />
        <h3>{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.average_rating)}
          </div>
          <span className="review-count">
            ({product.review_count || 0})
          </span>
        </div>
        <p>{product.price?.toFixed(2) || product.price} ₺</p>
      </Link>
      {isAdmin && (
        <div className="admin-info">
          <div className="admin-product-meta">
            <span className="admin-product-category"><FiTag style={{marginRight: 4}} /> {categoryName}</span>
            <span className="admin-product-price">{product.price?.toFixed(2) || product.price} ₺</span>
          </div>
          <div className="admin-controls">
            <button className="admin-btn ghost" title="Düzenle" onClick={() => onEdit?.(product)}><FiEdit2 /></button>
            <button className="admin-btn" title={product.is_visible ? "Gizle" : "Göster"} onClick={() => onToggleVisibility?.(product.id)}>
              {product.is_visible ? <FiEyeOff /> : <FiEye />}
            </button>
            <button className="admin-btn danger" title="Sil" onClick={() => onDelete?.(product.id)}><FiTrash2 /></button>
          </div>
        </div>
      )}
      {!isAdmin && (
        <button className="wishlist-add-cart-btn" onClick={() => addToCart(product.id)}>
          Sepete Ekle
        </button>
      )}
    </div>
  );
};

export default ProductCard;
