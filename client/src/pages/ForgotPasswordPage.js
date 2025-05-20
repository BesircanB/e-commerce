import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Şifre sıfırlama bağlantısı gönderildi.");
    } else {
      alert(data.message || "İşlem başarısız");
    }
  };

  return (
    <Modal>
      <form className="login-form" onSubmit={handleReset}>
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
    </Modal>
  );
};

export default ForgotPasswordPage;
