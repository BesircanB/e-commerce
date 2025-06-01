// server/routes/categories.js

const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkAdmin  = require("../middleware/checkAdmin");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory 

} = require("../controllers/categoryController");

router.get("/", getAllCategories); // public erişilebilir


//Admin için
router.post("/", verifyToken, checkAdmin, createCategory); // sadece admin
router.put("/:id", verifyToken, checkAdmin, updateCategory);
router.delete("/:id", verifyToken, checkAdmin, deleteCategory);


module.exports = router;
