import express from 'express';
import cors from 'cors';
import http from 'http';
import { 
  readDatabase, 
  verifyUserLogin,
  registerUser,
  updateUserProfile,
  getPortfolioData, 
  executeStockBuy, 
  executeStockSell, 
  resetPortfolioState 
} from './db.js';

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Enable CORS for frontend clients (Vite on :5173 or any origin)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Request logger for viva examiner audit
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

/* ==========================================================================
   1. Health & Server Status Endpoint
   ========================================================================== */
app.get('/api/health', (req, res) => {
  const db = readDatabase();
  res.json({
    status: 'ONLINE',
    system: 'StockSense AI Backend Server',
    port: PORT,
    timestamp: new Date().toISOString(),
    database: {
      storage: 'server/database.json',
      usersCount: db.users?.length || 0,
      holdingsCount: db.portfolio?.holdings?.length || 0,
      transactionsCount: db.portfolio?.transactions?.length || 0
    }
  });
});

/* ==========================================================================
   1b. List All Users Endpoint (GET /api/users)
   ========================================================================== */
app.get('/api/users', (req, res) => {
  const db = readDatabase();
  res.json({
    success: true,
    count: db.users?.length || 0,
    users: db.users || []
  });
});

/* ==========================================================================
   2. Authentication Endpoint (POST /api/auth/login)
   ========================================================================== */
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Verifying server login credentials for: ${email}`);
    
    const user = verifyUserLogin(email, password);

    return res.status(200).json({
      success: true,
      message: 'Server login verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: user.token,
        isLoggedIn: true
      }
    });
  } catch (error) {
    console.warn('[Auth Warning]', error.message);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'Authentication failed on server'
    });
  }
});

/* ==========================================================================
   2b. Account Registration Endpoint (POST /api/auth/signup)
   ========================================================================== */
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[Auth] Registering new personal account for: ${email}`);

    const user = registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message: 'Personal account created successfully on server',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: user.token,
        isLoggedIn: true
      }
    });
  } catch (error) {
    console.warn('[Signup Warning]', error.message);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || 'Registration failed on server'
    });
  }
});

/* ==========================================================================
   2b. Update Profile Endpoint (PUT /api/auth/profile)
   ========================================================================== */
app.put('/api/auth/profile', (req, res) => {
  try {
    const { email, name, role, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const updated = updateUserProfile(email, { name, role, avatar });
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully on server',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatar: updated.avatar,
        token: updated.token,
        isLoggedIn: true
      }
    });
  } catch (error) {
    console.error('[Profile Update Error]', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   3. Fetch Holdings Endpoint (GET /api/portfolio/holdings)
   ========================================================================== */
app.get('/api/portfolio/holdings', (req, res) => {
  try {
    const portfolio = getPortfolioData();
    return res.status(200).json({
      success: true,
      cash: portfolio.cash,
      startingCash: portfolio.startingCash,
      holdings: portfolio.holdings,
      transactions: portfolio.transactions,
      lastUpdated: portfolio.lastUpdated
    });
  } catch (error) {
    console.error('[Portfolio Fetch Error]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve holdings from server ledger'
    });
  }
});

/* ==========================================================================
   4. Buy Stock Endpoint (POST /api/portfolio/buy)
   ========================================================================== */
app.post('/api/portfolio/buy', (req, res) => {
  try {
    const { symbol, name, shares, price, sector } = req.body;
    
    if (!symbol || !shares || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required transaction fields: symbol, shares, and price'
      });
    }

    console.log(`[Trade BUY] Processing: ${shares} shares of ${symbol} @ $${price}`);

    const result = executeStockBuy(symbol, name, shares, price, sector);

    return res.status(201).json({
      success: true,
      message: `Successfully executed BUY for ${shares} shares of ${symbol}`,
      transaction: result.transaction,
      cash: result.updatedCash,
      holdings: result.holdings
    });
  } catch (error) {
    console.error('[Buy Trade Error]', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to execute stock buy on server'
    });
  }
});

/* ==========================================================================
   5. Sell Stock Endpoint (POST /api/portfolio/sell)
   ========================================================================== */
app.post('/api/portfolio/sell', (req, res) => {
  try {
    const { symbol, shares, price } = req.body;
    
    if (!symbol || !shares || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required trade parameters: symbol, shares, price'
      });
    }

    console.log(`[Trade SELL] Processing: ${shares} shares of ${symbol} @ $${price}`);

    const result = executeStockSell(symbol, shares, price);

    return res.status(200).json({
      success: true,
      message: `Successfully executed SELL for ${shares} shares of ${symbol}`,
      transaction: result.transaction,
      cash: result.updatedCash,
      holdings: result.holdings
    });
  } catch (error) {
    console.error('[Sell Trade Error]', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to execute stock sell on server'
    });
  }
});

/* ==========================================================================
   6. Reset Portfolio Endpoint (POST /api/portfolio/reset)
   ========================================================================== */
app.post('/api/portfolio/reset', (req, res) => {
  try {
    console.log('[Portfolio] Resetting virtual ledger to default $10,000 capital');
    const resetData = resetPortfolioState();
    return res.status(200).json({
      success: true,
      message: 'Portfolio successfully reset to $10,000.00 initial capital',
      cash: resetData.cash,
      holdings: resetData.holdings,
      transactions: resetData.transactions
    });
  } catch (error) {
    console.error('[Reset Error]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset portfolio on server'
    });
  }
});

// Dual listener: bind to both 127.0.0.1 and ::1 so both localhost and IP work seamlessly on macOS
const serverIPv4 = http.createServer(app);
serverIPv4.listen(PORT, '127.0.0.1', () => {
  console.log(`
  ==============================================================
  🚀 StockSense AI — Backend Server Active
  📡 URL: http://localhost:${PORT} or http://127.0.0.1:${PORT}
  💾 Database Ledger: server/database.json
  🛡️ CORS: Enabled for Frontend Clients
  🔌 Endpoints:
     • POST /api/auth/login
     • GET  /api/portfolio/holdings
     • POST /api/portfolio/buy
     • POST /api/portfolio/sell
     • POST /api/portfolio/reset
     • GET  /api/health
  ==============================================================
  `);
});

const serverIPv6 = http.createServer(app);
serverIPv6.on('error', () => {
  // Gracefully ignore if ::1 is already shared
});
serverIPv6.listen(PORT, '::1');
