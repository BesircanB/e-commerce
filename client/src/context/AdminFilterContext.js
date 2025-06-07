import React, { createContext, useContext, useState } from "react";

const AdminFilterContext = createContext();

export const useAdminFilters = () => useContext(AdminFilterContext);

export const AdminFilterProvider = ({ children }) => {
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("Varsayılan");

  return (
    <AdminFilterContext.Provider
      value={{
        categoryFilter,
        setCategoryFilter,
        priceRange,
        setPriceRange,
        sortOption,
        setSortOption,
      }}
    >
      {children}
    </AdminFilterContext.Provider>
  );
};
