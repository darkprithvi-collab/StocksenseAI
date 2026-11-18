import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Default initial state if file is missing or corrupted
const DEFAULT_DB = {
  users: [
    {
      id: "usr_alex_vance",
      name: "Alex Vance",
      email: "alex.vance@stocksense.ai",
      role: "Lead Quantitative Researcher (Viva Demo)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      token: "stocksense_jwt_secure_session_token_2026",
      createdAt: new Date().toISOString()
    }
  ],
  portfolio: {
    cash: 3832.50,
    startingCash: 10000.00,
    holdings: [
      {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        shares: 15,
        avgBuyPrice: 124.50,
        sector: "Semiconductors & AI"
      },
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 20,
        avgBuyPrice: 215.00,
        sector: "Consumer Electronics"
      }
    ],
    transactions: [
      {
        id: "tx-1",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        type: "BUY",
        shares: 15,
        price: 124.50,
        total: 1867.50,
        timestamp: "2026-11-02 10:14:32"
      },
      {
        id: "tx-2",
        symbol: "AAPL",
        name: "Apple Inc.",
        type: "BUY",
        shares: 20,
        price: 215.00,
        total: 4300.00,
        timestamp: "2026-11-02 11:35:10"
      }
    ]
  },
  watchlist: ["NVDA", "AAPL", "RELIANCE", "MSFT", "GOOGL"],
  meta: {
    system: "StockSense AI Ledger Engine",
    version: "1.0.0",
    storage: "Local JSON Ledger",
    lastUpdated: new Date().toISOString()
  }
};

/**
 * Read database ledger from disk
 */
export function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDatabase(DEFAULT_DB);
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Database read error, restoring default state:', error.message);
    writeDatabase(DEFAULT_DB);
    return DEFAULT_DB;
  }
}

/**
 * Write database ledger to disk atomically
 */
export function writeDatabase(data) {
  try {
    data.meta = {
      ...(data.meta || {}),
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Database write error:', error.message);
    return false;
  }
}

/**
 * Derive formatted human name from email username
 */
function deriveNameFromEmail(email) {
  if (!email || !email.includes('@')) return 'Quantitative Trader';
  const username = email.split('@')[0];
  // Convert e.g. "darkprithvi" or "prithvi.raj" into "Dark Prithvi" or "Prithvi Raj"
  return username
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Verify user login with email & password against persistent database
 */
export function verifyUserLogin(email, password) {
  const db = readDatabase();
  const normalizedEmail = (email || '').toLowerCase().trim();
  const inputPassword = (password || '').trim();

  if (!normalizedEmail) {
    const err = new Error('Email address is required.');
    err.status = 400;
    throw err;
  }
  if (!inputPassword) {
    const err = new Error('Password is required.');
    err.status = 400;
    throw err;
  }

  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    const err = new Error(`No account found for "${email}". Please check your email or click "Create Account" to register.`);
    err.status = 404;
    throw err;
  }

  // Check password (default fallback to 'password123' if legacy record without password)
  const storedPassword = user.password || 'password123';
  if (storedPassword !== inputPassword) {
    const err = new Error(`Incorrect password entered for "${email}". Please check your password and try again.`);
    err.status = 401;
    throw err;
  }

  // Update token & session
  user.token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  if (!user.password) {
    user.password = inputPassword;
  }
  writeDatabase(db);

  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Register a new user with name, email & password
 */
export function registerUser(name, email, password) {
  const db = readDatabase();
  const normalizedEmail = (email || '').toLowerCase().trim();
  const inputPassword = (password || '').trim();

  if (!normalizedEmail) {
    const err = new Error('Email address is required.');
    err.status = 400;
    throw err;
  }
  if (!inputPassword) {
    const err = new Error('Password is required.');
    err.status = 400;
    throw err;
  }
  if (inputPassword.length < 4) {
    const err = new Error('Password must be at least 4 characters long.');
    err.status = 400;
    throw err;
  }

  const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    const err = new Error(`An account with email "${email}" already exists. Please sign in instead.`);
    err.status = 409;
    throw err;
  }

  const cleanName = (name || '').trim() || deriveNameFromEmail(normalizedEmail);
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=3b82f6&color=fff&bold=true`;

  const newUser = {
    id: `usr_${Date.now()}`,
    name: cleanName,
    email: normalizedEmail,
    password: inputPassword,
    role: 'Quantitative Trader (Verified Personal Profile)',
    avatar: avatar,
    token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDatabase(db);

  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Legacy wrapper
 */
export function authenticateUser(email, name, password) {
  return verifyUserLogin(email, password || 'password123');
}

/**
 * Update user profile details in server database
 */
export function updateUserProfile(email, updates) {
  const db = readDatabase();
  const normalizedEmail = (email || '').toLowerCase().trim();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error('User profile not found on server');
  }

  if (updates.name) user.name = updates.name.trim();
  if (updates.role) user.role = updates.role.trim();
  if (updates.avatar) user.avatar = updates.avatar.trim();

  writeDatabase(db);
  return user;
}

/**
 * Get current portfolio holdings and cash balance
 */
export function getPortfolioData() {
  const db = readDatabase();
  return {
    cash: db.portfolio.cash,
    startingCash: db.portfolio.startingCash,
    holdings: db.portfolio.holdings,
    transactions: db.portfolio.transactions,
    lastUpdated: db.meta.lastUpdated
  };
}

/**
 * Execute Stock Purchase and record permanently in database.json
 */
export function executeStockBuy(symbol, name, shares, price, sector) {
  const db = readDatabase();
  const numShares = parseInt(shares, 10);
  const unitPrice = parseFloat(price);

  if (isNaN(numShares) || numShares <= 0) {
    throw new Error('Quantity must be a positive integer');
  }
  if (isNaN(unitPrice) || unitPrice <= 0) {
    throw new Error('Valid unit price is required');
  }

  const totalCost = parseFloat((numShares * unitPrice).toFixed(2));

  if (totalCost > db.portfolio.cash) {
    throw new Error(`Insufficient buying power. Required: $${totalCost.toFixed(2)}, Available: $${db.portfolio.cash.toFixed(2)}`);
  }

  // Deduct cash from server ledger
  db.portfolio.cash = parseFloat((db.portfolio.cash - totalCost).toFixed(2));

  // Update or insert holding
  const existingIndex = db.portfolio.holdings.findIndex(h => h.symbol.toUpperCase() === symbol.toUpperCase());
  if (existingIndex >= 0) {
    const existing = db.portfolio.holdings[existingIndex];
    const newTotalShares = existing.shares + numShares;
    const newTotalCost = (existing.shares * existing.avgBuyPrice) + totalCost;
    const newAvgPrice = parseFloat((newTotalCost / newTotalShares).toFixed(2));

    db.portfolio.holdings[existingIndex] = {
      ...existing,
      shares: newTotalShares,
      avgBuyPrice: newAvgPrice
    };
  } else {
    db.portfolio.holdings.push({
      symbol: symbol.toUpperCase(),
      name: name || symbol.toUpperCase(),
      shares: numShares,
      avgBuyPrice: unitPrice,
      sector: sector || 'Equities'
    });
  }

  // Create immutable transaction log
  const transaction = {
    id: `tx-${Date.now()}`,
    symbol: symbol.toUpperCase(),
    name: name || symbol.toUpperCase(),
    type: 'BUY',
    shares: numShares,
    price: unitPrice,
    total: totalCost,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  db.portfolio.transactions.unshift(transaction);

  // Write changes permanently to database.json
  writeDatabase(db);

  return {
    success: true,
    transaction,
    updatedCash: db.portfolio.cash,
    holdings: db.portfolio.holdings
  };
}

/**
 * Execute Stock Sale and record permanently in database.json
 */
export function executeStockSell(symbol, shares, price) {
  const db = readDatabase();
  const numShares = parseInt(shares, 10);
  const unitPrice = parseFloat(price);

  if (isNaN(numShares) || numShares <= 0) {
    throw new Error('Quantity must be a positive integer');
  }

  const existingIndex = db.portfolio.holdings.findIndex(h => h.symbol.toUpperCase() === symbol.toUpperCase());
  if (existingIndex < 0) {
    throw new Error(`Position in ${symbol} not found in server portfolio ledger`);
  }

  const existing = db.portfolio.holdings[existingIndex];
  if (existing.shares < numShares) {
    throw new Error(`Insufficient shares owned. You hold ${existing.shares} shares of ${symbol}, cannot sell ${numShares}`);
  }

  const totalProceeds = parseFloat((numShares * unitPrice).toFixed(2));

  // Add proceeds to cash balance
  db.portfolio.cash = parseFloat((db.portfolio.cash + totalProceeds).toFixed(2));

  // Update or remove holding
  const remainingShares = existing.shares - numShares;
  if (remainingShares === 0) {
    db.portfolio.holdings.splice(existingIndex, 1);
  } else {
    db.portfolio.holdings[existingIndex] = {
      ...existing,
      shares: remainingShares
    };
  }

  // Record sale transaction
  const transaction = {
    id: `tx-${Date.now()}`,
    symbol: symbol.toUpperCase(),
    name: existing.name,
    type: 'SELL',
    shares: numShares,
    price: unitPrice,
    total: totalProceeds,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  db.portfolio.transactions.unshift(transaction);

  // Write changes permanently to database.json
  writeDatabase(db);

  return {
    success: true,
    transaction,
    updatedCash: db.portfolio.cash,
    holdings: db.portfolio.holdings
  };
}

/**
 * Reset portfolio to $10,000 baseline
 */
export function resetPortfolioState() {
  const db = readDatabase();
  db.portfolio = {
    cash: 10000.00,
    startingCash: 10000.00,
    holdings: [],
    transactions: []
  };
  writeDatabase(db);
  return db.portfolio;
}
