import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Backend'e gönderilecek (şu an sadece console)
    console.log("Login data:", { email, password });

    // Başarılı giriş sonrası yönlendirme örneği
    // navigate("/");
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-container">
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
    </div>
  );
};

export default LoginPage;
