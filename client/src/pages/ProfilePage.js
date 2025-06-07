import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = () => setEditing((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/users/profile", formData);
      updateUser(res.data.user); // AuthContext güncelle
      setEditing(false);
      alert("Profil güncellendi");
    } catch (err) {
      console.error("Profil güncelleme hatası:", err);
      alert(err.response?.data?.error || "Bir hata oluştu");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Profilim</h2>

        {editing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ad Soyad"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefon"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adres"
            />
            <button type="submit">Kaydet</button>
            <button type="button" onClick={toggleEdit}>
              Vazgeç
            </button>
          </form>
        ) : (
          <div>
            <p><strong>Ad Soyad:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Telefon:</strong> {user?.phone || "-"}</p>
            <p><strong>Adres:</strong> {user?.address || "-"}</p>

            <div style={{ marginTop: "1rem" }}>
              <button onClick={toggleEdit}>Profili Düzenle</button>
              <button onClick={() => navigate("/change-password")}>Şifre Değiştir</button>
              <button onClick={() => navigate("/orders")}>Siparişlerim</button>
              <button onClick={() => navigate("/profile/my-reviews")}>Yorumlarım</button> {/* ✅ eklendi */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
