// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // 1. Check if the token was sent in the HTTP headers
    // Standard practice is to send it in the "Authorization" header as "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract just the token string (remove the word "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using your secret key
            // This mathematically proves the token hasn't been tampered with or expired
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Attach the decoded user ID to the request object
            // Remember how we put { id: user.id } inside the token when they logged in?
            // Now any route that uses this middleware instantly knows exactly which user is making the request.
            req.user = decoded; 

            // 5. Let them pass to the actual route controller
            next(); 
            
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // 6. If no token was found at all
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };