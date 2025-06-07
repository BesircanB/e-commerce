import React from "react";
import { useCampaigns } from "../../context/CampaignContext";
import { useCategories } from "../../context/CategoryContext";

const CampaignList = () => {
  const { campaigns, deleteCampaign } = useCampaigns();
  const { categories } = useCategories();

  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Kategori Yok";
  };

  if (campaigns.length === 0) {
    return <p>Hiç kampanya bulunamadı.</p>;
  }

  return (
    <div style={gridStyle}>
      {campaigns.map((camp) => (
        <div key={camp.id} style={cardStyle}>
          <h4>{camp.name}</h4>
          <p><strong>İndirim:</strong> %{camp.discount_percent}</p>
          <p><strong>Min. Tutar:</strong> {camp.min_order_price || 0} ₺</p>
          <p><strong>Kategori:</strong> {getCategoryName(camp.category_id)}</p>
          <button onClick={() => deleteCampaign(camp.id)}>Sil</button>
        </div>
      ))}
    </div>
  );
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "1rem",
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
};

export default CampaignList;
