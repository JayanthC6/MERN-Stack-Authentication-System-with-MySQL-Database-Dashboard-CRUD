const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// --- 1. REGISTER USER ---
exports.register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        await db.query(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- 2. LOGIN USER ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1d' }
        );

        // Send response (excluding the password)
        res.status(200).json({
            message: 'Login successful',
            token,
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

// --- 3. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // 3. Save token and expiry (1 hour from now) to database
        await db.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?',
            [resetToken, email]
        );

        // 4. Create a test email account on the fly (Ethereal)
        const testAccount = await nodemailer.createTestAccount();
        
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // 5. Create the reset URL pointing to your React frontend
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // 6. Send the email
        const info = await transporter.sendMail({
            from: '"AppSpace Security" <security@appspace.com>',
            to: email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click here to reset: ${resetUrl}`,
            html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link expires in 1 hour.</p>`,
        });

        // 7. Log the URL to the terminal so you can easily click it!
        console.log("-----------------------------------------");
        console.log("📧 EMAIL SENT! Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("🔗 DIRECT RESET LINK: ", resetUrl);
        console.log("-----------------------------------------");

        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
};

// --- 4. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 1. Find user with this token and ensure it hasn't expired
        const [users] = await db.query(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const user = users[0];

        // 2. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update the password and clear the reset token
        await db.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.status(200).json({ message: 'Password has been successfully reset' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

// --- 5. GET CURRENT USER (ME) ---
exports.getMe = async (req, res) => {
    try {
        // req.user.id is provided by your JWT 'protect' middleware
        const [users] = await db.query(
            'SELECT id, name, email, phone, created_at FROM users WHERE id = ?', 
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data (excluding the password!)
        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error fetching user data' });
    }
};