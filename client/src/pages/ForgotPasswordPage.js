import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Lütfen e-posta girin.");
      return;
    }

    // Şifre sıfırlama isteği (şu an sadece simülasyon)
    console.log("Şifre sıfırlama isteği:", email);

    // İleride backend'e POST istek gönderilecek
    // await fetch("http://localhost:5000/api/auth/reset-password", { ... })
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h2>Şifre Sıfırla</h2>

        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Şifre Sıfırla</button>

        <div className="login-links-row">
          <Link to="/login">Giriş Yap</Link>
          <Link to="/register">Kayıt Ol</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
