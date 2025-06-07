import React from "react";
import { useAdminFilters } from "../../context/AdminFilterContext";

const AdminProductFilters = () => {
  const {
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    sortOption,
    setSortOption,
  } = useAdminFilters();

  return (
    <div style={filterStyle}>
      <div>
        <label>Kategori ID:</label>
        <input
          type="number"
          value={categoryFilter || ""}
          onChange={(e) => setCategoryFilter(Number(e.target.value) || null)}
          placeholder="Tümü"
        />
      </div>

      <div>
        <label>Fiyat Aralığı:</label>
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange([Number(e.target.value), priceRange[1]])
          }
        />
        <span> - </span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
        />
      </div>

      <div>
        <label>Sırala:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="Varsayılan">Varsayılan</option>
          <option value="FiyatArtan">Fiyat (Artan)</option>
          <option value="FiyatAzalan">Fiyat (Azalan)</option>
          <option value="StokAz">Stok (Azalan)</option>
          <option value="StokÇok">Stok (Artan)</option>
        </select>
      </div>
    </div>
  );
};

const filterStyle = {
  display: "flex",
  gap: "2rem",
  marginTop: "1rem",
  alignItems: "center",
  flexWrap: "wrap",
};

export default AdminProductFilters;
