import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const ChangePasswordModal = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Yeni şifreler uyuşmuyor.");
      return;
    }

    const result = changePassword(form.oldPassword, form.newPassword);

    if (result.success) {
      setSuccess("Şifre başarıyla değiştirildi.");
      setTimeout(() => navigate("/profile"), 1500);
    } else {
      setError(result.message || "Bir hata oluştu.");
    }
  };

  return (
    <Modal>
      <h2>Şifre Değiştir</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Mevcut Şifre"
          value={form.oldPassword}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "0.5rem 0", width: "100%" }}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Yeni Şifre"
          value={form.newPassword}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "0.5rem 0", width: "100%" }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Yeni Şifre (Tekrar)"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "0.5rem 0", width: "100%" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "green",
            color: "white",
            width: "100%",
            padding: "0.5rem",
            border: "none",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          Şifreyi Güncelle
        </button>
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>}
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
