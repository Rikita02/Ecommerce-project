const express = require("express");
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Create a new product (Admin only)
router.post("/create", authMiddleware, adminMiddleware, createProduct);

// Get all products
router.get("/", getAllProducts);

// Get a single product by ID
router.get("/:id", getProductById);

// Update a product (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// Delete a product (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
