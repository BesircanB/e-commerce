// components/Header/GuestLinks.js
import React from "react";
import { Link } from "react-router-dom";

const GuestLinks = () => {
  return (
    <>
      <Link to="/login">Giriş</Link>
      <Link to="/register">Kayıt Ol</Link>
    </>
  );
};

export default GuestLinks;
