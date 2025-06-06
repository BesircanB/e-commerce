import React from "react";
import Header from "../components/Header";
import { useCategories } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList"; // ✅ ürünleri göstermek için eklendi

const HomePage = () => {
  const { categories } = useCategories();
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <main className="homepage-main">
        <h2 style={{ textAlign: "center", marginTop: "1rem" }}>
          Hoş Geldiniz 👋
        </h2>

        {/* ✅ Kategori Butonları */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
            margin: "1rem 0",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ✅ Tüm Ürünler Gösterilir */}
        <ProductList />
      </main>
    </div>
  );
};

export default HomePage;
