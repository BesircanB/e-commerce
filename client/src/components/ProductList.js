import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import mockProducts from "../models/mockProducts"; // ✅ Tek doğru yerden import

const ProductList = () => {
  const { searchTerm } = useSearch();

  const filteredProducts = mockProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-grid">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
          Aradığınız ürün bulunamadı.
        </p>
      )}
    </div>
  );
};

export default ProductList;
