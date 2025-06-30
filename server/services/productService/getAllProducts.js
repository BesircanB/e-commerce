const supabase = require("../supabase");

async function getAllProducts({ category, sortBy, minPrice, maxPrice }) {
  let query = supabase
    .from("crud")
    .select(`
      *,
      reviews (
        rating
      )
    `)
    .eq("is_visible", true);

  if (category) {
    query = query.eq("category", category);
  }

  if (minPrice) {
    query = query.gte("price", Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte("price", Number(maxPrice));
  }

  if (sortBy === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sortBy === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false }); // default: en yeni
  }

  const { data: products, error } = await query;

  if (error) {
    throw new Error("Ürünler getirilemedi");
  }

  // Calculate average rating and review count for each product
  const productsWithRatings = products.map(product => {
    const reviews = product.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    return {
      ...product,
      average_rating: Number(averageRating.toFixed(1)),
      review_count: reviewCount,
      reviews: undefined // Remove the reviews array since we don't need it in the frontend
    };
  });

  return productsWithRatings;
}

module.exports = getAllProducts;
