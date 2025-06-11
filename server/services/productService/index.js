const createProduct = require("./createProduct");
const updateProduct = require("./updateProduct");
const getAllProducts = require("./getAllProducts");
const getAllProductsAdmin = require("./getAllProductsAdmin");
const getProductById = require("./getProductById");
const getProductByIdAdmin = require("./getProductByIdAdmin");
const updateProductStock = require("./updateStock"); // ✅ artık mevcut
const toggleVisibility = require("./toggleVisibility");
const deleteProduct = require("./deleteProduct");


module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  getProductByIdAdmin,
  updateProductStock,
  toggleVisibility,
  deleteProduct,
};
