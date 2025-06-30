import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiPackage, FiLogOut } from "react-icons/fi";
import AccountInfo from "../components/Profile/AccountInfo";
import OrdersPage from "./OrdersPage";
import ReviewsPage from "./ReviewsPage";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { logout } = useAuth();

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <nav className="profile-nav">
          <Link to="/profile" className="profile-nav-item">
            <FiUser /> Hesap Bilgilerim
          </Link>
          <Link to="/profile/orders" className="profile-nav-item">
            <FiPackage /> Siparişlerim
          </Link>
          <button onClick={logout} className="profile-nav-item logout">
            <FiLogOut /> Çıkış
          </button>
        </nav>
      </aside>

      <main className="profile-content">
        <Routes>
          <Route path="/" element={<AccountInfo />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default ProfilePage;
