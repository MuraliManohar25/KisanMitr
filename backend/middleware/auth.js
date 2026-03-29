import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fair-trade-scanner-secret-key-change-in-production';

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password hash
    delete user.password_hash;

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

