import React, { useState } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import ChangePasswordModal from "../components/ChangePasswordModal";
import "../components/Profile/AccountInfo.css";

const AdminProfilePage = () => {
  const { profile, updateProfile, loading } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address } = formData;
    const result = await updateProfile({ name, phone, address });
    if (result.success) {
      setEditing(false);
    } else {
      alert(result.message || "Profil güncellenemedi");
    }
  };

  if (loading) {
    return <div className="account-info-loading">Yükleniyor...</div>;
  }

  return (
    <div className="admin-dashboard-main">
      <div className="account-info" style={{ maxWidth: 500, margin: "2rem auto" }}>
        <h2>Profil Bilgileri</h2>
        {editing ? (
          <form className="account-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="5XX XXX XX XX"
                />
              </div>
              <div className="form-group">
                <label>Adres</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Adresinizi giriniz"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Kaydet
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditing(false)}
              >
                Vazgeç
              </button>
            </div>
          </form>
        ) : (
          <div className="account-info-view">
            <div className="info-row">
              <span className="info-label">Ad Soyad:</span>
              <span className="info-value">{profile?.name || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{profile?.email || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Telefon:</span>
              <span className="info-value">{profile?.phone || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Adres:</span>
              <span className="info-value">{profile?.address || "-"}</span>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={() => setEditing(true)}>
                Profili Düzenle
              </button>
              <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
                Şifre Değiştir
              </button>
            </div>
          </div>
        )}
      </div>
      {showPasswordModal && <ChangePasswordModal />}
    </div>
  );
};

export default AdminProfilePage; 