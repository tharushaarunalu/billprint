const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files like CSS, JS, images

// Session configuration to maintain login state
app.use(session({
    secret: 'adminSecretKey', // Replace with a more secure secret
    resave: false, // Don't save session if it's not modified
    saveUninitialized: true, // Save uninitialized session data
    cookie: { secure: false } // For development (set secure: true in production with HTTPS)
}));

// Set the view engine to EJS
app.set('view engine', 'ejs'); // View engine setup for rendering .ejs files
app.set('views', path.join(__dirname, 'views')); // Path to views directory

// Import and use routes
const routes = require('./routes/index'); // Assuming routes are in ./routes/index.js
app.use('/', routes); // Use routes for all paths starting with "/"

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
