import React from "react";
import Header from "../components/Header";
import ProductList from "../components/ProductList";

const HomePage = () => {
  return (
    <div>
      <Header />

      <main className="homepage-main">
        <h2 style={{ textAlign: "center", marginTop: "1rem" }}>
          Hoş Geldiniz 👋
        </h2>
        <ProductList />
      </main>
    </div>
  );
};

export default HomePage;
