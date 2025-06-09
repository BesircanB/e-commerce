const createCampaign = require("./createCampaign");
const getAllCampaigns = require("./getAllCampaigns");
const getCampaignByCode = require("./getCampaignByCode");
const updateCampaign = require("./updateCampaign");
const toggleCampaignStatus = require("./toggleStatus");
const deleteCampaign = require("./deleteCampaign");

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignByCode,
  updateCampaign,
  toggleCampaignStatus,
  deleteCampaign,
};
