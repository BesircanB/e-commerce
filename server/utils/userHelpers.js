function sanitizeProfileInput(input) {
  const clean = {};

  if (input.name) clean.name = input.name.trim();
  if (input.email) clean.email = input.email.trim().toLowerCase();
  if (input.phone) clean.phone = input.phone.trim();
  if (input.address) clean.address = input.address.trim();

  return clean;
}

function validatePasswordChange({ oldPassword, newPassword }) {
  if (!oldPassword || !newPassword) {
    return "Eski ve yeni şifre zorunludur";
  }

  if (newPassword.length < 6) {
    return "Yeni şifre en az 6 karakter olmalıdır";
  }

  return null; // hata yok
}

module.exports = {
  sanitizeProfileInput,
  validatePasswordChange,
};
