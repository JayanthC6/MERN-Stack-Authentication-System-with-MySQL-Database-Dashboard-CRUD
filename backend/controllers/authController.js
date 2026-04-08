// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Import JWT
const db = require('../config/db');

exports.register = async (req, res) => {
    // ... (Keep your existing register code exactly as it is) ...
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- NEW LOGIN FUNCTION ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation: Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // 2. Check if user exists in the database
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // 3. Security: Compare the plain text password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Keep error vague for security
        }

        // 4. Generate the JWT "VIP Wristband"
        const token = jwt.sign(
            { id: user.id }, // The payload (data inside the token)
            process.env.JWT_SECRET, // The secret key to sign it
            { expiresIn: process.env.JWT_EXPIRE } // How long until the token is invalid
        );

        // 5. Send the token and user data back to the frontend
        res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// --- GET CURRENT USER FUNCTION ---
exports.getMe = async (req, res) => {
    try {
        // req.user.id is automatically provided by our 'protect' middleware!
        // We explicitly select the columns we want, making sure NOT to select the password.
        const [users] = await db.query(
            'SELECT id, name, email, phone, created_at FROM users WHERE id = ?', 
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error fetching user data' });
    }
};