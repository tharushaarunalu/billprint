const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env

const CartItem = require('./models/CartItem');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Connect to MongoDB using the .env variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/bill-calculator', async (req, res) => {
    const cart = await CartItem.find();
    const total = cart.reduce((sum, item) => sum + item.totalAfterDiscount, 0);

    res.render('pages/bill-calculator', { cart, total });
});

app.post('/bill-calculator', async (req, res) => {
    const { itemName, quantity, price, discountRate } = req.body;

    const subtotal = quantity * price;
    const totalAfterDiscount = subtotal - (subtotal * (discountRate / 100));

    const newCartItem = new CartItem({
        itemName,
        quantity,
        price,
        subtotal,
        discount: discountRate,
        totalAfterDiscount
    });

    await newCartItem.save();
    res.redirect('/bill-calculator');
});

app.post('/clear-cart', async (req, res) => {
    await CartItem.deleteMany({});
    res.redirect('/bill-calculator');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
