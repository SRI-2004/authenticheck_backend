const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const tokenBearer = req.header('Authorization');
    const token = tokenBearer.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. User is not an admin' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
