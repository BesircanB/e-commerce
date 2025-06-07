// components/Header/UserLinks.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserLinks = () => {
  const { logout } = useAuth();

  return (
    <>
      <Link to="/cart">🛒 Sepetim</Link>
      <Link to="/wishlist">🤍 Favoriler</Link>
      <Link to="/orders">📦 Siparişler</Link>
      <Link to="/profile">👤 Profil</Link>
      <button onClick={logout} className="logout-btn">🚪 Çıkış</button>
    </>
  );
};

export default UserLinks;
