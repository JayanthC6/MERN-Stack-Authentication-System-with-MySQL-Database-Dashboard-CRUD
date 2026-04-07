const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// 1. Force the exact absolute path to your .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 2. Import database connection ONLY AFTER dotenv is successfully configured
const db = require('./config/db');

const app = express();

// 3. Middleware to parse incoming JSON requests
app.use(express.json());

// 4. Import and attach your API routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});