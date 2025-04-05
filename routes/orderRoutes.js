const express = require("express");
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, processPayment } = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/update", authMiddleware, adminMiddleware, updateOrderStatus);
router.post("/payment", authMiddleware, processPayment);

module.exports = router;
