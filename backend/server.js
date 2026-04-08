const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors'); // 1. Import CORS

// Force the exact absolute path to your .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import database connection ONLY AFTER dotenv is successfully configured
const db = require('./config/db');

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // 2. Enable CORS so React can talk to this API
app.use(express.json()); // Parse incoming JSON requests

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});