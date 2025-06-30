import React from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList/ProductList";

const CampaignsByCategory = () => {
  const { categoryId } = useParams();
  return (
    <div>
      <ProductList selectedCategoryId={categoryId} />
    </div>
  );
};

export default CampaignsByCategory; 