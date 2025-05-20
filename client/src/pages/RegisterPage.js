import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

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

    // Backend'e veri gönderme örneği
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Kayıt başarılı");
      navigate("/login");
    } else {
      alert(data.message || "Kayıt başarısız");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Modal>
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

        <div className="form-note">
          <span>Zaten hesabınız var mı?</span>
          <Link to="/login">Giriş Yap</Link>
        </div>

        <div className="divider">veya</div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleRegister}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Google ile Kayıt Ol
        </button>
      </form>
    </Modal>
  );
};

export default RegisterPage;
