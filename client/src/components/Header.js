import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const { cartItems } = useCart();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0); // ✅ DÜZELTME

  return (
    <header className="header">
      {/* Sol: Logo */}
      <div className="header-left">
        <Link to="/" className="header-logo">
          E-Ticaret
        </Link>
      </div>

      {/* Orta: Arama */}
      <div className="header-center">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>🔍</button>
      </div>

      {/* Sağ: Profil, Favoriler ve Sepet */}
      <div className="header-right">
        {user ? (
          <>
            <Link to="/profile" className="action-item">
              <span className="icon">👤</span>
              <span className="label">Profil</span>
            </Link>

            <Link to="/wishlist" className="action-item">
              <span className="icon">💖</span>
              <span className="label">Favorilerim</span>
            </Link>

            <button onClick={logout} className="action-item logout-btn">
              <span className="icon">🚪</span>
              <span className="label">Çıkış</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="action-item">
            <span className="icon">👤</span>
            <span className="label">Giriş Yap</span>
          </Link>
        )}

        <Link to="/cart" className="action-item cart-icon">
          <span className="icon">🛒</span>
          <span className="label">Sepet</span>
          {totalQuantity > 0 && (
            <span className="cart-count">{totalQuantity}</span> // ✅ doğru adet
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
