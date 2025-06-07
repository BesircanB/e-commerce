import React, { useState } from "react";
import { useCategories } from "../../context/CategoryContext";

const CategoryForm = () => {
  const { addCategory } = useCategories();
  const [newName, setNewName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCategory({ name: newName.trim() });
    setNewName("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Yeni kategori adı"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit">➕ Ekle</button>
    </form>
  );
};

export default CategoryForm;
