const express = require('express');
const router = express.Router();

let inventory = []; // Inventory data
let loggedIn = false;

// Root URL
router.get('/', (req, res) => {
    if (loggedIn) {
        res.redirect('/dashboard'); // Redirect to dashboard if logged in
    } else {
        res.redirect('/login'); // Redirect to login if not logged in
    }
});

// Login page
router.get('/login', (req, res) => {
    res.render('pages/login', { error: null });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123') {
        loggedIn = true;
        res.redirect('/dashboard');
    } else {
        res.render('pages/login', { error: 'Invalid credentials' });
    }
});

// Dashboard
router.get('/dashboard', (req, res) => {
    if (!loggedIn) return res.redirect('/login');
    res.render('pages/dashboard');
});

// Add Items
router.get('/add-items', (req, res) => {
    if (!loggedIn) return res.redirect('/login');
    res.render('pages/add-items', { inventory });
});

router.post('/add-items', (req, res) => {
    const { itemNumber, itemName, price, quantity, image } = req.body;
    inventory.push({ itemNumber, itemName, price, quantity, image });
    res.redirect('/add-items');
});

// Bill Calculator (GET)
router.get('/bill-calculator', (req, res) => {
    if (!loggedIn) return res.redirect('/login');
    res.render('pages/bill-calculator', { inventory, cart: [], discount: 0, total: 0 });
});

// Bill Calculator route (POST)
router.post('/bill-calculator', (req, res) => {
    const { itemId, quantity, discountRate } = req.body;
    const selectedItem = inventory.find(item => item.itemNumber === itemId);

    if (!selectedItem) {
        // If the item is not found, send an error message
        return res.render('pages/bill-calculator', { 
            inventory, 
            error: 'Item not found', 
            discount: 0, // Also pass 0 discount when there's an error
            cart: [] // Empty cart since there's no valid item
        });
    }

    // Update inventory and calculate total
    selectedItem.quantity -= quantity; // Deduct purchased quantity
    const itemTotal = selectedItem.price * quantity; // Subtotal for the item

    // Calculate discount
    const discount = (itemTotal * discountRate) / 100;
    const total = itemTotal - discount;

    // Add to cart (temporary array)
    const cart = [{ ...selectedItem, quantity, itemTotal, discount, total }];

    res.render('pages/bill-calculator', {
        inventory,
        cart,
        discount: discountRate, // Pass the discount value here
        total: total,           // Pass the final total here
        error: null             // No error in this case
    });
});


// Log out
router.get('/logout', (req, res) => {
    loggedIn = false;
    res.redirect('/login');
});

module.exports = router;
