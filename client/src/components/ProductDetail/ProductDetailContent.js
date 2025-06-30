import React, { useState } from "react";
import { useProductDetail } from "../../context/ProductDetailContext";
import ProductImageModal from "./ProductImageModal";
import ProductInfoCard from "./ProductInfoCard";
import ProductActionButtons from "./ProductActionButtons";
import ProductReviews from "../ProductReviews/ProductReviews";
import SimilarProductsSection from "./SimilarProductsSection";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import "./ProductDetailContent.css";

const ProductDetailContent = () => {
  const {
    product,
    loading,
    isImageModalOpen,
    setImageModalOpen,
    hasPurchased,
    selectedModel,
    selectedColor,
  } = useProductDetail();

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

  // Find selected variant
  const selectedVariant = product?.variants?.find(
    v => v.model === selectedModel && v.color === selectedColor
  );

  if (loading) {
    return <div className="product-detail-loading">Yükleniyor...</div>;
  }

  if (!product) {
    return <div className="product-detail-loading">Ürün bulunamadı.</div>;
  }

  return (
    <div className="product-detail-main">
      <div className="product-detail-card">
        <div className="product-detail-image-area">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-detail-image"
            onClick={() => setImageModalOpen(true)}
          />
          <div className="product-detail-rating">
            <div className="stars">
              {renderStars(product.average_rating || 0)}
            </div>
            <span className="review-count">
              ({product.review_count || 0} yorum)
            </span>
          </div>
        </div>
        <div className="product-detail-info-area">
          <ProductInfoCard 
            product={product} 
            hasPurchased={hasPurchased} 
            selectedVariant={selectedVariant}
          />
          <ProductActionButtons product={product} />
        </div>
      </div>
      {isImageModalOpen && <ProductImageModal />}
      <SimilarProductsSection product={product} />
      <div className="product-detail-reviews-area">
        <ProductReviews
          productId={product.id}
          averageRating={product.average_rating || 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailContent;
