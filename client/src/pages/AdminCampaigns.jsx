import React from "react";
import CampaignForm from "../components/admin_temp/CampaignForm";
import CampaignList from "../components/admin_temp/CampaignList";
import Header from "../components/Header/Header"; // ✅ Eklendi

const AdminCampaigns = () => {
  return (
    <>
      <Header /> {/* ✅ Eklendi */}
      <div style={{ padding: "2rem" }}>
        <h2>Kampanya Yönetimi</h2>
        <CampaignForm />
        <CampaignList />
      </div>
    </>
  );
};

export default AdminCampaigns;
