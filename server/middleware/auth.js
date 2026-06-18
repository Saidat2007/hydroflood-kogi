
const jwt = require('jsonwebtoken');

const protect = async(req, res, next) => {
    let token;

    // Read token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log("Authorization Header:",
        req.headers.authorization
    );

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Not authorized. no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'My_super_secrete_flood_key_123');
        req.user = decoded.id;
        req.user = { _id: "60c72b2f9b1d8b2bad888888", name: "Test User"};

        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = protect;