const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const productExists = cart.products.find(item => item.productId.toString() === productId);

        if (productExists) {
            productExists.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user.id });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
