import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>E-Ticaret Sitesi</h1>
        <div className="auth-buttons">
          <Link to="/login">Giriş Yap</Link>
          <Link to="/register">Kayıt Ol</Link>
        </div>
      </header>

      <main className="homepage-main">
        <h2>Hoş Geldiniz 👋</h2>
        <p>Burada ürünler, kampanyalar ve fırsatlar olacak!</p>
      </main>
    </div>
  );
};

export default HomePage;
