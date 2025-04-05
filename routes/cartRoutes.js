const express = require("express");
const { addToCart, getCart, removeFromCart, clearCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
