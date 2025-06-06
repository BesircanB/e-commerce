import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../context/CategoryContext"; // ✅ eklendi

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onToggleVisibility,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const { categories } = useCategories(); // ✅ context'ten kategori adları alındı
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? category.name : "—";

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div className="product-card">
      {!isAdmin && user && (
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
        <img src={product.image || product.image_url} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.price.toFixed(2)} ₺</p>

        {isAdmin && (
          <>
            <p><strong>Kategori:</strong> {categoryName}</p>
            <p><strong>Stok:</strong> {product.stock}</p>
            <p>
              <strong>Gösterim:</strong>{" "}
              {product.is_visible ? (
                <span style={{ color: "green" }}>🟢 Açık</span>
              ) : (
                <span style={{ color: "red" }}>🔴 Kapalı</span>
              )}
            </p>
          </>
        )}
      </Link>

      {!isAdmin ? (
        <button onClick={() => addToCart(product.id)}>Sepete Ekle</button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            marginTop: "0.5rem",
          }}
        >
          <button onClick={() => onEdit?.(product)}>✏ Düzenle</button>
          <button onClick={() => onToggleVisibility?.(product.id)}>
            {product.is_visible ? "👁 Gizle" : "👁 Göster"}
          </button>
          <button onClick={() => onDelete?.(product.id)} style={{ color: "red" }}>
            🗑 Sil
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
