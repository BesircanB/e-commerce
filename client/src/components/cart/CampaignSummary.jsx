// src/components/cart/CampaignSummary.jsx
import React from "react";

const CampaignSummary = ({ campaigns }) => {
  if (!campaigns) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      {campaigns.auto?.length > 0 && (
        <>
          <h4>Otomatik Kampanyalar:</h4>
          <ul>
            {campaigns.auto.map((camp, index) => (
              <li key={index}>
                {camp.title} - {camp.amount.toFixed(2)} ₺
              </li>
            ))}
          </ul>
        </>
      )}

      {campaigns.code && (
        <p>
          ✔ Kupon: <strong>{campaigns.code.code}</strong> –{" "}
          {campaigns.code.amount.toFixed(2)} ₺
        </p>
      )}
    </div>
  );
};

export default CampaignSummary;
