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

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">E-Ticaret</Link>
      </div>

      <div className="header-center">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>🔍</button>
      </div>

      <div className="header-right">
        {user?.role === "admin" ? (
          <>
            <Link to="/admin" className="action-item">
              <span className="icon">🛠️</span>
              <span className="label">Ürünler</span>
            </Link>

            <Link to="/admin/orders" className="action-item">
              <span className="icon">📊</span>
              <span className="label">Muhasebe</span>
            </Link>

            <Link to="/profile" className="action-item">
              <span className="icon">👤</span>
              <span className="label">Profil</span>
            </Link>

            <button onClick={logout} className="action-item logout-btn">
              <span className="icon">🚪</span>
              <span className="label">Çıkış</span>
            </button>
          </>
        ) : (
          <>
            {user && (
              <Link to="/profile" className="action-item">
                <span className="icon">👤</span>
                <span className="label">Profil</span>
              </Link>
            )}

            {user && (
              <Link to="/wishlist" className="action-item">
                <span className="icon">💖</span>
                <span className="label">Favoriler</span>
              </Link>
            )}

            <Link to="/cart" className="action-item cart-icon">
              <span className="icon">🛒</span>
              <span className="label">Sepet</span>
              {totalQuantity > 0 && (
                <span className="cart-count">{totalQuantity}</span>
              )}
            </Link>

            {user ? (
              <button onClick={logout} className="action-item logout-btn">
                <span className="icon">🚪</span>
                <span className="label">Çıkış</span>
              </button>
            ) : (
              <Link to="/login" className="action-item">
                <span className="icon">👤</span>
                <span className="label">Giriş Yap</span>
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
