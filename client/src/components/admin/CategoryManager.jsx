import React, { useState } from "react";
import { useCategories } from "../../context/CategoryContext";

const CategoryManager = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory, // ✅ silme context'ten
  } = useCategories();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCategory({ name: newName.trim() });
    setNewName("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingName.trim()) return;
    updateCategory(editingId, { name: editingName.trim() });
    setEditingId(null);
    setEditingName("");
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (categoryId) => {
    setErrorMsg("");
    try {
      await deleteCategory(categoryId); // context üzerinden silme isteği
    } catch (err) {
      console.error("Silme hatası:", err);
      setErrorMsg(err.message || "Kategori silinemedi");
    }
  };

  return (
    <div style={{ marginTop: "3rem" }}>
      <h3>📂 Kategori Yönetimi</h3>

      {/* Kategori Ekleme */}
      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Yeni kategori adı"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">➕ Ekle</button>
      </form>

      {/* Hata mesajı */}
      {errorMsg && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Kategori Listesi */}
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} style={{ marginBottom: "0.5rem" }}>
            {editingId === cat.id ? (
              <form onSubmit={handleUpdate} style={{ display: "inline" }}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                <button type="submit">💾 Kaydet</button>
                <button type="button" onClick={cancelEditing} style={{ marginLeft: "0.5rem" }}>
                  İptal
                </button>
              </form>
            ) : (
              <>
                <strong>{cat.name}</strong>
                <button
                  onClick={() => startEditing(cat)}
                  style={{ marginLeft: "1rem", color: "blue" }}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{ marginLeft: "0.5rem", color: "red" }}
                >
                  Sil
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
