const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const contactRoutes = require('./src/routes/contactRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { createTable } = require('./src/models/contactModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const rateLimit = require('express-rate-limit');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests, please try again later.' }
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(limiter); // Apply global rate limiter
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', contactRoutes);
app.use('/api', adminRoutes);

// Database Setup
createTable();

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
