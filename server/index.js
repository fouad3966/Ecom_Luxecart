import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getDb, closeDb } from './db/connection.js';
import { seedDatabase } from './db/seed.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import couponRoutes from './routes/coupons.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---

// Security headers — relaxed CSP for cross-origin API calls (Vercel → Render)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — allow specific origins for Vercel and local dev
app.use(cors({
  origin: [
    'https://ecom-luxecart.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000'
  ],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts, please try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '2mb' }));

// Input sanitization — strip HTML tags from all string inputs to prevent stored XSS
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  next();
});

function sanitizeObject(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(/<[^>]*>/g, '').trim();
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(item =>
        typeof item === 'string' ? item.replace(/<[^>]*>/g, '').trim() : item
      );
    } else if (obj[key] && typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
}

// --- Routes ---

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start ---

async function start() {
  try {
    // Initialize database
    await getDb();
    console.log('✓ Database initialized');

    // Seed if empty
    await seedDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 LuxeCart API server running at http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});

start();
