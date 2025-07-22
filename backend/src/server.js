import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import clubRoutes from './routes/clubs.js';
import messageRoutes from './routes/messages.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true, // Allow cookies
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Campus Cliq API'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', authMiddleware, postRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/clubs', authMiddleware, clubRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);

// 404 handler - this should come AFTER all valid routes
app.use('*', (req, res, next) => {
  // Create an error object and pass it to the next middleware
  const error = new Error('Endpoint not found');
  error.status = 404;
  next(error);
});

// Error handling middleware (MUST BE LAST)
// It will catch any errors passed by next()
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Campus Cliq API server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});