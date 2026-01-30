import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

// Middleware to check DB connection
const requireDB = (req, res, next) => {
  // Allow requests to proceed even if DB is not connected for demo purposes
  // In production, you might want to enforce DB connection
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', requireDB, register);

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
router.post('/login', requireDB, login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', requireDB, protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', requireDB, protect, updateProfile);

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', requireDB, protect, changePassword);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', requireDB, protect, logout);

export default router;
