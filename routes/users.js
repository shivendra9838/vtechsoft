import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';

const router = express.Router();

// Middleware to check DB connection
const requireDB = (req, res, next) => {
  // Allow requests to proceed even if DB is not connected for demo purposes
  // In production, you might want to enforce DB connection
  next();
};

// All user routes are protected and require admin access
router.use(requireDB);
router.use(protect);
router.use(adminOnly);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', getUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private/Admin
router.get('/stats', getUserStats);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/:id', getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', deleteUser);

export default router;
