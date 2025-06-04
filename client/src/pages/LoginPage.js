import React, { useState } from "react";
import Modal from "../components/Modal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/axiosInstance";
import GoogleLoginButton from "../components/GoogleLoginButton"; // ✅ yeni bileşen

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });

      const { token, user } = response.data;

      // AuthContext'e login (hem user hem token)
      login({ userData: user, token });

      // Role bazlı yönlendirme
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.error || "Giriş başarısız");
    }
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

        {/* ✅ Yeni Google Login butonu */}
        <GoogleLoginButton />
      </form>
    </Modal>
  );
};

export default LoginPage;
