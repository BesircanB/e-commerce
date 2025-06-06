import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        background: "#222",
        color: "white",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem" }}>
        E-Ticaret
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        {user?.role === "admin" ? (
          <>
            <Link to="/admin" className="action-item" style={{ color: "white" }}>
              🛠️ Ürünler
            </Link>

            <Link to="/admin/campaigns" className="action-item" style={{ color: "white" }}>
              🎯 Kampanyalar
            </Link>

            <Link to="/admin/orders" className="action-item" style={{ color: "white" }}>
              📦 Siparişler
            </Link>

            <Link to="/admin/stats" className="action-item" style={{ color: "white" }}>
              📊 İstatistikler
            </Link>

            <Link to="/profile" className="action-item" style={{ color: "white" }}>
              👤 Profil
            </Link>

            <button
              onClick={logout}
              className="action-item logout-btn"
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              🚪 Çıkış
            </button>
          </>
        ) : user ? (
          <>
            <Link to="/cart" style={{ color: "white" }}>🛒 Sepetim</Link>
            <Link to="/wishlist" style={{ color: "white" }}>🤍 Favoriler</Link>
            <Link to="/orders" style={{ color: "white" }}>📦 Siparişler</Link>
            <Link to="/profile" style={{ color: "white" }}>👤 Profil</Link>
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              🚪 Çıkış
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white" }}>Giriş</Link>
            <Link to="/register" style={{ color: "white" }}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
