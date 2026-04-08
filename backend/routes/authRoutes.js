const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // 1. Import the Bouncer

router.post('/register', authController.register);
router.post('/login', authController.login);

// 2. NEW protected route. The request hits 'protect' first. If it passes, it goes to 'getMe'.
router.get('/me', protect, authController.getMe); 

module.exports = router;