import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";

const ChangePasswordModal = () => {
  const navigate = useNavigate();
  const { updatePassword } = useUserProfile();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor");
      return;
    }
    const result = await updatePassword({ oldPassword: currentPassword, newPassword });
    if (result.success) {
      alert("Şifre başarıyla güncellendi");
      navigate(-1);
    } else {
      setError(result.message || "Bir hata oluştu");
    }
  };

  return (
    <div className="change-password-modal-wrapper">
      <div className="change-password-modal-card">
        <button className="modal-close" onClick={() => navigate(-1)}>×</button>
        <h2 className="change-password-title">Şifre Değiştir</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="change-password-form-row">
            <input
              type="password"
              name="currentPassword"
              placeholder="Mevcut Şifre"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="change-password-form-row">
            <input
              type="password"
              name="newPassword"
              placeholder="Yeni Şifre"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Yeni Şifre (Tekrar)"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="change-password-btn">Şifreyi Güncelle</button>
        </form>
        {error && <p className="change-password-error">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
