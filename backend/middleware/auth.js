import jwt from 'jsonwebtoken';

// middleware to check if user is logged in
const authMiddleware = (req, res, next) => {
  try {
    // get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Need to login first' });
    }
    
    // token format: "Bearer token123"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Need to login first' });
    }
    
    // verify token
    const secret = process.env.JWT_SECRET || 'secret-key';
    const decoded = jwt.verify(token, secret);
    
    // add userId to request so routes can use it
    req.userId = decoded.userId;
    
    // continue to next route
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

export default authMiddleware;

