import jwt from "jsonwebtoken"

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({ message: "Invalid token !!" });
        // If token is valid, attach user id to request
        req.userId = decoded.userId;
        next();
        
    } catch (error) {
        return res.status(401).json({ message: "Error Validating Token" });
        
    }
}