function validateCategoryInput(data) {
  if (!data || typeof data.name !== "string" || !data.name.trim()) {
    return { error: "Kategori adı geçerli bir string olmalıdır" };
  }

  return { error: null };
}

function sanitizeCategoryInput(data) {
  return {
    name: data.name.trim().toLowerCase(), // örneğin 'Elektronik' → 'elektronik'
  };
}

module.exports = {
  validateCategoryInput,
  sanitizeCategoryInput,
};
