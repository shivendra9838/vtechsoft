import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contact.js';
import chatbotRoutes from './routes/chatbot.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://vtechsoft-frontend.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  const { checkConnection } = await import('./config/db.js');
  const dbConnected = checkConnection();
  
  res.json({
    success: true,
    message: 'VTECHSOFT API is running',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbConnected,
      status: dbConnected ? 'connected' : 'disconnected'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to VTECHSOFT Technology API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/password',
        logout: 'POST /api/auth/logout',
      },
      users: {
        getAll: 'GET /api/users (Admin)',
        getStats: 'GET /api/users/stats (Admin)',
        getOne: 'GET /api/users/:id (Admin)',
        update: 'PUT /api/users/:id (Admin)',
        delete: 'DELETE /api/users/:id (Admin)',
      },
      blog: {
        getAll: 'GET /api/blog',
        getOne: 'GET /api/blog/:id',
        create: 'POST /api/blog (Admin)',
        update: 'PUT /api/blog/:id (Admin)',
        delete: 'DELETE /api/blog/:id (Admin)',
      },
      contact: {
        submit: 'POST /api/contact',
      },
      chatbot: {
        chat: 'POST /api/chatbot',
        clearHistory: 'DELETE /api/chatbot/:sessionId',
      },
      health: 'GET /api/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
