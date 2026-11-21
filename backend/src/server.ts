import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { isSupabaseConfigured } from './config/supabase';
import vendorRoutes from './routes/vendorRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app: Application = express();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching origins
    if (!origin) return callback(null, true);
    // Allow localhost or any vercel.app deployment preview
    if (
      origin.includes('localhost') ||
      origin.endsWith('.vercel.app') ||
      origin === CLIENT_URL
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for initial Vercel deployment preview stages
  },
  credentials: true
}));
app.use(express.json());

// Base health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'TRUG Hyperlocal Backend',
    platform: 'Vercel Serverless Ready',
    database: {
      provider: 'Supabase',
      configured: isSupabaseConfigured,
      note: isSupabaseConfigured
        ? 'Connected to Supabase'
        : 'Standby mode: Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Project Environment Variables'
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Fallback route for root api
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to TRUG Backend API',
    endpoints: [
      '/api/health',
      '/api/vendors',
      '/api/products',
      '/api/orders',
      '/api/categories'
    ]
  });
});

// Local development listener (when run with tsx / node directly)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 TRUG Backend running at http://localhost:${PORT}`);
    console.log(`🔌 Supabase status: ${isSupabaseConfigured ? 'CONNECTED' : 'STANDBY (Awaiting credentials)'}`);
  });
}

// Export for Vercel serverless function wrapper
export default app;
