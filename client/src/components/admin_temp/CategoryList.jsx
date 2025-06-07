import React from "react";
import { useCategories } from "../../context/CategoryContext";

const CategoryList = () => {
  const { categories, deleteCategory, updateCategory } = useCategories();

  const handleNameChange = (id, newName) => {
    if (!newName.trim()) return;
    updateCategory(id, { name: newName.trim() });
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {categories.map((cat) => (
        <li
          key={cat.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <span>{cat.name}</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => {
                const yeni = prompt("Yeni ad:", cat.name);
                if (yeni !== null) handleNameChange(cat.id, yeni);
              }}
            >
              ✏️
            </button>
            <button onClick={() => deleteCategory(cat.id)}>🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
