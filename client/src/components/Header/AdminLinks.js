// components/Header/AdminLinks.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLinks = () => {
  const { logout } = useAuth();

  return (
    <>
      <Link to="/admin">🛠️ Ürünler</Link>
      <Link to="/admin/campaigns">🎯 Kampanyalar</Link>
      <Link to="/admin/orders">📦 Siparişler</Link>
      <Link to="/admin/stats">📊 İstatistikler</Link>
      <Link to="/profile">👤 Profil</Link>
      <button onClick={logout} className="logout-btn">🚪 Çıkış</button>
    </>
  );
};

export default AdminLinks;
