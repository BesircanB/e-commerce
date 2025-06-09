const supabase = require("../supabase");

async function logSearchQuery({ userId = null, query, category, tag }) {
  // Boş arama kaydetmeye gerek yok
  if (!query && !category && !tag) return;

  const payload = {
    user_id: userId,
    query: query || "",
    category_id: category ? Number(category) : null,
    tag: tag || null,
  };

  await supabase.from("search_logs").insert(payload);
}

module.exports = logSearchQuery;
