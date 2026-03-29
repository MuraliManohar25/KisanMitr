import express from 'express';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fair-trade-scanner-secret-key-change-in-production';

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, farmerName, location, phone } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingByEmail = await UserModel.findByEmail(email);
    const existingByUsername = await UserModel.findByUsername(username);
    if (existingByEmail || existingByUsername) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await UserModel.create({
      username,
      email,
      password,
      farmerName: farmerName || '',
      location: location || '',
      phone: phone || ''
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        farmerName: user.farmerName,
        location: user.location
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await UserModel.comparePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        farmerName: user.farmerName,
        location: user.location
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
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

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        farmerName: user.farmerName,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

