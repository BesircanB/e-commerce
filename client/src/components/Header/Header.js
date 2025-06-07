// components/Header/Header.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLinks from "./AdminLinks";
import UserLinks from "./UserLinks";
import GuestLinks from "./GuestLinks";
import "./Header.css";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">E-Ticaret</Link>
      </div>

      <div className="header-right">
        {user?.role === "admin" ? (
          <AdminLinks />
        ) : user ? (
          <UserLinks />
        ) : (
          <GuestLinks />
        )}
      </div>
    </header>
  );
};

export default Header;
