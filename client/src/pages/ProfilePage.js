import React from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Profilim</h2>
        <p><strong>İsim:</strong> {user?.name || "Kullanıcı"}</p>
        <p><strong>Email:</strong> {user?.email}</p>

        <div style={{ marginTop: "1rem" }}>
          <button style={{ marginRight: "1rem" }}>Şifre Değiştir</button>
          <button onClick={() => navigate("/orders")}>Siparişlerim</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
