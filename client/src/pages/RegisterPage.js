import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor");
      return;
    }

    // Backend'e kayıt isteği gönderilecek (şimdilik sadece simülasyon)
    console.log("Kayıt verisi:", { name, email, password });

    // navigate("/login");
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Kayıt Ol</h2>

        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre Tekrar"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Kayıt Ol</button>

        {/* 🔽 Bu kısım düz yazı + link */}
        <div className="form-note">
          <span>Zaten hesabınız var mı?</span>
          <Link to="/login">Giriş Yap</Link>
        </div>

        <div className="divider">veya</div>

        <button type="button" className="google-button" onClick={handleGoogleRegister}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Google ile Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
