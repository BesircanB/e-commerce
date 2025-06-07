import React from "react";
import { useProductDetail } from "../../context/ProductDetailContext";
import ProductImageModal from "./ProductImageModal";
import ProductInfoCard from "./ProductInfoCard";
import ProductActionButtons from "./ProductActionButtons";
import ProductReviews from "../ProductReviews/ProductReviews";

const ProductDetailContent = () => {
  const {
    product,
    loading,
    isImageModalOpen,
    setImageModalOpen,
    hasPurchased,
  } = useProductDetail();

  if (loading) {
    return <p style={{ padding: "2rem" }}>Yükleniyor...</p>;
  }

  if (!product) {
    return <p style={{ padding: "2rem" }}>Ürün bulunamadı.</p>;
  }

  return (
    <div>
      {/* Ürün görsel ve bilgi */}
      <div style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: "300px", borderRadius: "8px", cursor: "pointer" }}
          onClick={() => setImageModalOpen(true)}
        />
        <div style={{ flex: 1 }}>
          <ProductInfoCard product={product} hasPurchased={hasPurchased} />
          <ProductActionButtons product={product} />
        </div>
      </div>

      {/* Görsel modal */}
      {isImageModalOpen && <ProductImageModal />}

      {/* Yorumlar */}
      <div style={{ padding: "2rem" }}>
        <ProductReviews
          productId={product.id}
          averageRating={product.averageRating || 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailContent;
