const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 }
        }
    ],
    amount: { type: Number, required: true },
    paymentId: { type: String },
    status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
