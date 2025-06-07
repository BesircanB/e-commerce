import React from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductActionButtons = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = () => {
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={handleWishlistToggle}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: isInWishlist(product.id) ? "red" : "gray",
          }}
          title={isInWishlist(product.id) ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          {isInWishlist(product.id) ? "❤️" : "🤍"}
        </button>

        <button
          onClick={() => addToCart(product.id)}
          disabled={product.stock <= 0}
          style={{
            backgroundColor: product.stock <= 0 ? "#ccc" : "#28a745",
            color: product.stock <= 0 ? "#666" : "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: product.stock <= 0 ? "not-allowed" : "pointer",
          }}
        >
          {product.stock <= 0 ? "Stokta Yok" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
};

export default ProductActionButtons;
