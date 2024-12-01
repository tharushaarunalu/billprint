const mongoose = require('mongoose');

// Define Cart Item Schema
const CartItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    totalAfterDiscount: { type: Number, required: true }
});

// Export the model
module.exports = mongoose.model('CartItem', CartItemSchema);
