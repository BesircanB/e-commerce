import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axiosInstance";
import Header from "../components/Header";
import ProductReviews from "../components/ProductReviews";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Ürün alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkIfPurchased = async () => {
      if (!user || !product) return;

      try {
        const res = await axios.get("/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const allItems = res.data.flatMap((order) => order.order_items || []);
        const productIds = allItems.map((item) => item.product_id);
        if (productIds.includes(product.id)) {
          setHasPurchased(true);
        }
      } catch (err) {
        console.error("Sipariş kontrolü başarısız:", err);
      }
    };

    checkIfPurchased();
  }, [user, product]);

  if (loading) {
    return (
      <div>
        <Header />
        <p style={{ padding: "2rem" }}>Yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <p style={{ padding: "2rem" }}>Ürün bulunamadı.</p>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div>
      <Header />

      {/* Ürün detayları */}
      <div style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: "300px", borderRadius: "8px", cursor: "pointer" }}
          onClick={() => setImageModalOpen(true)}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h2>{product.name}</h2>
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
          </div>

          <p>{product.description || "Ürün açıklaması mevcut değil."}</p>
          <h3>{product.price.toFixed(2)} ₺</h3>
          {/* ✅ Stok etiketi kontrolü */}
          {product.stock <= 0 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>Tükendi</p>
          ) : (
            <p><strong>Stok:</strong> {product.stock}</p>
          )}

          {hasPurchased && (
            <p style={{ color: "green", fontWeight: "bold", marginTop: "0.5rem" }}>
              Bu ürünü daha önce satın aldınız.
            </p>
          )}

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
            marginTop: "1rem",
          }}
            >
              {product.stock <= 0 ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      </div>

      {/* Ürün görselini büyütme modalı */}
      {isImageModalOpen && (
        <div
          onClick={() => setImageModalOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(255,255,255,0.2)"
            }}
          />
        </div>
      )}

      {/* Yorumlar */}
      <div style={{ padding: "2rem" }}>
        <ProductReviews productId={product.id} averageRating={product.averageRating} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
