// components/ProductCard/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCategories } from "../../context/CategoryContext";

import WishlistIcon from "./WishlistIcon";
import AdminCardControls from "./AdminCardControls";

const ProductCard = ({ product, onEdit, onDelete, onToggleVisibility }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { categories } = useCategories();

  const isAdmin = user?.role === "admin";
  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? category.name : "—";

  return (
    <div className="product-card">
      {!isAdmin && user && <WishlistIcon product={product} />}

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
        <AdminCardControls
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
        />
      )}
    </div>
  );
};

export default ProductCard;
