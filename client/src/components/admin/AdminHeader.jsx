import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBox, FiPackage, FiBarChart2, FiGift, FiLayers, FiUser, FiLogOut, FiKey } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useAdminProducts } from "../../context/AdminProductContext";
import "./AdminHeader.css";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const { searchAdminProducts, products, loading } = useAdminProducts();
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchAdminProducts(value);
    setShowSearchResults(!!value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchAdminProducts(search);
    setShowSearchResults(!!search);
  };

  const handleResultClick = (productId) => {
    setShowSearchResults(false);
    setSearch("");
    navigate(`/product/${productId}`);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <Link to="/admin" className="admin-header-logo">Dijital Kare</Link>
      </div>
      <div className="admin-header-center" style={{ position: "relative" }}>
        <form className="admin-search-form" onSubmit={handleSearch} autoComplete="off">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Ürün, sipariş, kampanya ara..."
            value={search}
            onChange={handleInputChange}
            onFocus={() => setShowSearchResults(!!search)}
            autoComplete="off"
          />
          <button type="submit" className="admin-search-btn">ARA</button>
        </form>
        {showSearchResults && (
          <div className="admin-search-dropdown" style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(25, 118, 210, 0.13)",
            zIndex: 1002,
            maxHeight: 320,
            overflowY: "auto"
          }}>
            {loading ? (
              <div style={{ padding: "1rem", color: "#1976d2" }}>Yükleniyor...</div>
            ) : products.length === 0 ? (
              <div style={{ padding: "1rem", color: "#888" }}>Sonuç bulunamadı</div>
            ) : (
              products.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  className="admin-search-result-item"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.7rem 1.2rem", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
                  onClick={() => handleResultClick(p.id)}
                >
                  <img src={p.image || p.image_url || "/placeholder.png"} alt={p.name} style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 8, background: "#f5f7fa" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#1976d2", fontSize: 15 }}>{p.name}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>{p.description?.slice(0, 60)}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: "#43a047", fontSize: 15, minWidth: 70, textAlign: "right" }}>{p.price?.toLocaleString()} ₺</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <nav className="admin-header-nav">
        <Link to="/admin" className="admin-nav-link"><FiBox /> <span>Ürünler</span></Link>
        <Link to="/admin/orders" className="admin-nav-link"><FiPackage /> <span>Siparişler</span></Link>
        <Link to="/admin/dashboard" className="admin-nav-link"><FiBarChart2 /> <span>İstatistikler</span></Link>
        <Link to="/admin/campaigns" className="admin-nav-link"><FiGift /> <span>Kampanyalar</span></Link>
        <Link to="/admin/categories" className="admin-nav-link"><FiLayers /> <span>Kategoriler</span></Link>
        <div className="admin-profile-menu" ref={dropdownRef}>
          <button className="admin-profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <FiUser /> <span>{user?.name || "Admin"}</span>
          </button>
          {showDropdown && (
            <div className="admin-dropdown-menu">
              <Link to="/admin/profile" className="admin-dropdown-item"><FiUser /> Profil</Link>
              <Link to="/admin/change-password" className="admin-dropdown-item"><FiKey /> Şifre Değiştir</Link>
              <Link to="/admin/orders" className="admin-dropdown-item"><FiPackage /> Siparişler</Link>
              <button onClick={logout} className="admin-dropdown-item logout"><FiLogOut /> Çıkış</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader; 