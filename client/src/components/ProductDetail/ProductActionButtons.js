import React from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductActionButtons.css";

const ProductActionButtons = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div className="product-action-buttons">
      <button
        className={`fav-btn ${isInWishlist(product.id) ? "active" : ""}`}
        onClick={handleWishlistToggle}
        title={isInWishlist(product.id) ? "Favorilerden çıkar" : "Favorilere ekle"}
      >
        {isInWishlist(product.id) ? "❤️" : "🤍"}
      </button>
      <button
        className="add-cart-btn"
        onClick={() => addToCart(product.id)}
        disabled={product.stock <= 0}
      >
        {product.stock <= 0 ? "Stokta Yok" : "Sepete Ekle"}
      </button>
    </div>
  );
};

export default ProductActionButtons;
