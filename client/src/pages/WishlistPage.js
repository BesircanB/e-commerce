import React from "react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Favorilerim</h2>

        {wishlist.length === 0 ? (
          <div style={{ marginTop: "2rem" }}>
            <p>Henüz favori ürününüz bulunmamaktadır.</p>
            <p>Ürünleri favorilere eklemek için kalp simgesine tıklayın.</p>
          </div>
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
