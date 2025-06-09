const register = require("./registerUser");
const login = require("./loginUser");
const googleLogin = require("./googleLogin");
const forgotPassword = require("./forgotPassword");
const resetPassword = require("./resetPassword");

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
};
