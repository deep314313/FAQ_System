require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { faqRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Custom CSP middleware instead of helmet's CSP
app.use(
    helmet({
        contentSecurityPolicy: false // Disable helmet's CSP
    })
);

// Set custom Content-Security-Policy
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.ckeditor.com; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.ckeditor.com; " +
        "img-src 'self' data: https: http:; " +
        "connect-src 'self' https://cdn.ckeditor.com; " +
        "font-src 'self' https://cdn.jsdelivr.net https://cdn.ckeditor.com; " +
        "frame-src 'self' https://cdn.ckeditor.com"
    );
    next();
});

app.use(morgan('dev'));

// Debug middleware to log request body
app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log('Request Body:', req.body);
    }
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/faqs', faqRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use(errorHandler);

// Database connection
console.log('Connecting to MongoDB:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} in your browser to view the application`);
    });
})
.catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

module.exports = app;
