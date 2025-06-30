import React from "react";
import CampaignForm from "../components/admin_temp/CampaignForm";
import CampaignList from "../components/admin_temp/CampaignList";
import Footer from "../components/Footer/Footer";

const AdminCampaigns = () => {
  return (
    <>
      <h2 style={{marginBottom: '2rem'}}>Kampanya Yönetimi</h2>
      <CampaignForm />
      <CampaignList />
      <Footer />
    </>
  );
};

export default AdminCampaigns;
