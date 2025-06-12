import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../context/ProductDetailContext";
import Header from "../components/Header/Header";
import ProductDetailContent from "../components/ProductDetail/ProductDetailContent";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { fetchProduct } = useProductDetail();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  return (
    <div>
      <div className="product-detail-container">
        <ProductDetailContent />
      </div>
    </div>
  );
};

export default ProductDetailPage;
