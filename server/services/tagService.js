const supabase = require("./supabase");

async function getAllTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("id, name");
  if (error) throw new Error(error.message);
  return data;
}

module.exports = { getAllTags }; 