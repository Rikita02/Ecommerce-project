const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Razorpay = require("razorpay");
require("dotenv").config();
// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create an order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalAmount = cart.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

        const order = new Order({
            userId,
            products: cart.products,
            amount: totalAmount,
            status: "Pending"
        });

        await order.save();
        await Cart.findOneAndDelete({ userId });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate("products.productId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("products.productId userId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Process payment using Razorpay
exports.processPayment = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: "order_rcptid_11"
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
