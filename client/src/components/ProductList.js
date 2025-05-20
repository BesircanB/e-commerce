import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";

// Şimdilik sahte ürün verisi
const mockProducts = [
  {
    id: 1,
    title: "Kırmızı Tişört",
    price: 199.99,
    image: "https://via.placeholder.com/300x200?text=Ürün+1",
  },
  {
    id: 2,
    title: "Mavi Ceket",
    price: 399.99,
    image: "https://via.placeholder.com/300x200?text=Ürün+2",
  },
  {
    id: 3,
    title: "Spor Ayakkabı",
    price: 599.99,
    image: "https://via.placeholder.com/300x200?text=Ürün+3",
  },
];

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
