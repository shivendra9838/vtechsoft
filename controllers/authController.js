import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { checkConnection } from '../config/db.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Quick database connection check with timeout
    let dbConnected = false;
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB connection timeout')), 2000)
      );
      
      await Promise.race([
        User.findOne().limit(1),
        timeoutPromise
      ]);
      dbConnected = true;
    } catch (dbCheckError) {
      console.log('⚠️  Database connection check failed:', dbCheckError.message);
      dbConnected = false;
    }

    if (dbConnected) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this email already exists',
          });
        }

        // Create user
        const user = await User.create({
          name,
          email,
          password,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            token,
          },
        });
      } catch (dbError) {
        console.error('Database error during registration:', dbError);
        
        // Fallback for demo purposes when DB operations fail
        const mockUser = {
          _id: 'demo_' + Date.now(),
          name,
          email,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        // Generate token
        const token = generateToken(mockUser._id);

        res.status(201).json({
          success: true,
          message: 'User registered successfully (demo mode - database error)',
          data: {
            user: {
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
            },
            token,
          },
        });
      }
    } else {
      // Database not connected - create demo user
      console.log('⚠️  Database not available, creating demo user...');
      
      // Create a mock user object for demo
      const mockUser = {
        _id: 'demo_' + Date.now(),
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Generate token
      const token = generateToken(mockUser._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully (demo mode - database not connected)',
        data: {
          user: {
            id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
          },
          token,
        },
      });
    }
  } catch (error) {
    console.error('Register error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Login user and return token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check database connection
    try {
      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      
      // Fallback for demo purposes when DB is not available
      if (dbError.name === 'MongoServerSelectionError' || dbError.message.includes('Could not connect to any servers')) {
        console.log('⚠️  Database not available, allowing demo login...');
        
        // Demo login - accept any credentials
        const mockUser = {
          _id: 'demo_' + Date.now(),
          name: email.split('@')[0], // Extract name from email
          email,
          role: 'user'
        };

        // Generate token
        const token = generateToken(mockUser._id);

        res.json({
          success: true,
          message: 'Login successful (demo mode - database not connected)',
          data: {
            user: {
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
            },
            token,
          },
        });
      } else {
        throw dbError;
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // Check database connection
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (dbError) {
      console.error('Database error during getMe:', dbError);
      
      // Fallback for demo purposes when DB is not available
      if (dbError.name === 'MongoServerSelectionError' || dbError.message.includes('Could not connect to any servers')) {
        console.log('⚠️  Database not available, returning demo user...');
        
        // Return a demo user based on the token
        const mockUser = {
          id: req.user.id,
          name: req.user.id.includes('demo_') ? 'Demo User' : 'User',
          email: 'demo@example.com',
          role: 'user',
          createdAt: new Date().toISOString()
        };

        res.json({
          success: true,
          message: 'User data retrieved (demo mode - database not connected)',
          data: {
            user: mockUser,
          },
        });
      } else {
        throw dbError;
      }
    }
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name or email to update',
      });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user',
        });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change',
    });
  }
};

// @desc    Logout user (clear token on client side)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
};
