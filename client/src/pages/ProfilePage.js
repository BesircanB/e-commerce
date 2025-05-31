import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../context/AddressContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const { address, setAddress } = useAddress();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = () => setEditing(!editing);

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Profilim</h2>
        <p><strong>İsim:</strong> {user?.name || "Kullanıcı"}</p>
        <p><strong>Email:</strong> {user?.email}</p>

        <div style={{ marginTop: "1rem" }}>
          <button
            style={{ marginRight: "1rem" }}
            onClick={() => navigate("/change-password")}
          >
            Şifre Değiştir
          </button>
          <button onClick={() => navigate("/orders")}>Siparişlerim</button>
        </div>

        <hr style={{ margin: "2rem 0" }} />

        <h3>Adres Bilgileri</h3>

        {editing ? (
          <form>
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              placeholder="Ad Soyad"
              style={{ display: "block", margin: "0.5rem 0" }}
            />
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Sokak / Cadde"
              style={{ display: "block", margin: "0.5rem 0" }}
            />
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="Şehir"
              style={{ display: "block", margin: "0.5rem 0" }}
            />
            <input
              type="text"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              placeholder="Posta Kodu"
              style={{ display: "block", margin: "0.5rem 0" }}
            />
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="Ülke"
              style={{ display: "block", margin: "0.5rem 0" }}
            />
            <button type="button" onClick={toggleEdit}>Kaydet</button>
          </form>
        ) : (
          <div>
            <p><strong>Ad Soyad:</strong> {address.fullName || "-"}</p>
            <p><strong>Adres:</strong> {address.street || "-"}</p>
            <p><strong>Şehir:</strong> {address.city || "-"}</p>
            <p><strong>Posta Kodu:</strong> {address.postalCode || "-"}</p>
            <p><strong>Ülke:</strong> {address.country || "-"}</p>
            <button onClick={toggleEdit}>Düzenle</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
