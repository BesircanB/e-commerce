import React from "react";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

const CategoryManager = () => {
  return (
    <div style={{ padding: "2rem" }}>
      
      <CategoryForm />
      <CategoryList />
    </div>
  );
};

export default CategoryManager;
