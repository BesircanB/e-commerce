function sanitizeSearchInput(params = {}) {
  const {
    q,
    category,
    tag,
    min_price,
    max_price,
    in_stock,
  } = params;

  const cleaned = {
    q: q?.trim().toLowerCase() || "",
    category: category ? Number(category) : null,
    tag: tag || null,
    min_price: min_price ? Number(min_price) : null,
    max_price: max_price ? Number(max_price) : null,
    in_stock: in_stock === "true" ? true : false,
    max_stock: params.max_stock ? Number(params.max_stock) : null,
    stock: params.stock !== undefined ? Number(params.stock) : null
  };

  return cleaned;
}


function buildSearchQuery(queryBuilder, filters, isAdmin = false) {
  const { q, category, tag, min_price, max_price, in_stock, stock } = filters;

  if (filters.max_stock !== undefined && filters.max_stock !== null) {
       queryBuilder = queryBuilder.lte("stock", filters.max_stock);
  }

  if (q) {
    queryBuilder = queryBuilder.ilike("name", `%${q}%`);
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category_id", category);
  }

  if (tag) {
    queryBuilder = queryBuilder.contains("tags", [tag]);
  }

  if (min_price !== null) {
    queryBuilder = queryBuilder.gte("price", min_price);
  }

  if (max_price !== null) {
    queryBuilder = queryBuilder.lte("price", max_price);
  }

  if (in_stock) {
    queryBuilder = queryBuilder.gt("stock", 0);
  }

  if (stock !== undefined && stock !== null) {
    queryBuilder = queryBuilder.eq("stock", stock);
  }

  if (!isAdmin) {
    queryBuilder = queryBuilder.eq("is_visible", true);
  }

  return queryBuilder;
}


module.exports = {
  sanitizeSearchInput,
  buildSearchQuery,
};
