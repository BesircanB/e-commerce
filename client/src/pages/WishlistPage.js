import React from "react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header"; // ✅ Header eklendi

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div>
      <Header /> {/* ✅ Header burada */}
      <div style={{ padding: "2rem" }}>
        <h2>Favorilerim</h2>

        {wishlist.length === 0 ? (
          <p>Henüz favori ürün yok.</p>
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
