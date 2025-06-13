const tagService = require("../services/tagService");

async function getAllTags(req, res) {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllTags }; 