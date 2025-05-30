import React, { useState } from "react";
import Modal from "../components/Modal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

  // ✅ Role belirle
  const role =
    email === "admin@example.com" || email === "admin2@example.com"
      ? "admin"
      : "user";

  // ✅ Role ile login yap
  login({ email, role });

  // ✅ Role'a göre yönlendirme
  navigate(role === "admin" ? "/admin" : "/");
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Modal>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Giriş Yap</h2>

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

        <button type="submit">Giriş Yap</button>

        <div className="login-links-row">
          <Link to="/forgot-password">Şifremi Unuttum</Link>
          <Link to="/register">Kayıt Ol</Link>
        </div>

        <div className="divider">veya</div>

        <button type="button" className="google-button" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Google ile Giriş Yap
        </button>
      </form>
    </Modal>
  );
};

export default LoginPage;
