/**
 * StockSense AI Client-Server HTTP API Client
 * Connects React Frontend to Express Backend Server (Port 5000)
 */

const API_BASE_URL = 'http://localhost:5000/api';

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  token: string;
  isLoggedIn: boolean;
}

export interface ServerHolding {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  sector: string;
}

export interface ServerTransaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface ServerPortfolioData {
  cash: number;
  startingCash: number;
  holdings: ServerHolding[];
  transactions: ServerTransaction[];
  lastUpdated: string;
}

/**
 * Check if the Express server is online and running on port 5000
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ONLINE';
  } catch (error) {
    return false;
  }
}

/**
 * POST /api/auth/login
 * Verify user authentication with the Express backend
 */
export async function apiLogin(email: string, password?: string): Promise<{ success: boolean; user?: ServerUser; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  } catch (error: any) {
    console.warn('[API Client] Server login offline:', error.message);
    return { success: false, message: error.message || 'Cannot reach server on port 5000' };
  }
}

/**
 * POST /api/auth/signup
 * Register a new user account with the Express backend
 */
export async function apiSignup(name: string, email: string, password?: string): Promise<{ success: boolean; user?: ServerUser; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await response.json();
  } catch (error: any) {
    console.warn('[API Client] Server signup offline:', error.message);
    return { success: false, message: error.message || 'Cannot reach server on port 5000' };
  }
}

/**
 * PUT /api/auth/profile
 * Update user profile details on the server
 */
export async function apiUpdateProfile(payload: {
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}): Promise<{ success: boolean; user?: ServerUser; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error: any) {
    console.warn('[API Client] Server profile update offline:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * GET /api/portfolio/holdings
 * Fetch stored stock purchase records & balance from server database.json
 */
export async function apiGetHoldings(): Promise<{ success: boolean; data?: ServerPortfolioData; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/holdings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const res = await response.json();
    if (res.success) {
      return {
        success: true,
        data: {
          cash: res.cash,
          startingCash: res.startingCash,
          holdings: res.holdings || [],
          transactions: res.transactions || [],
          lastUpdated: res.lastUpdated
        }
      };
    }
    return { success: false, message: res.message };
  } catch (error: any) {
    console.warn('[API Client] Server holdings fetch offline:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * POST /api/portfolio/buy
 * Execute stock purchase on server and save record permanently into database.json
 */
export async function apiBuyStock(payload: {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  sector?: string;
}): Promise<{
  success: boolean;
  message: string;
  transaction?: ServerTransaction;
  cash?: number;
  holdings?: ServerHolding[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error: any) {
    console.warn('[API Client] Server buy offline:', error.message);
    return { success: false, message: error.message || 'Server connection failed' };
  }
}

/**
 * POST /api/portfolio/sell
 * Execute stock sale on server and update database.json
 */
export async function apiSellStock(payload: {
  symbol: string;
  shares: number;
  price: number;
}): Promise<{
  success: boolean;
  message: string;
  transaction?: ServerTransaction;
  cash?: number;
  holdings?: ServerHolding[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error: any) {
    console.warn('[API Client] Server sell offline:', error.message);
    return { success: false, message: error.message || 'Server connection failed' };
  }
}

/**
 * POST /api/portfolio/reset
 * Reset server portfolio ledger to $10,000 initial balance
 */
export async function apiResetPortfolio(): Promise<{
  success: boolean;
  message: string;
  cash?: number;
  holdings?: ServerHolding[];
  transactions?: ServerTransaction[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error: any) {
    console.warn('[API Client] Server reset offline:', error.message);
    return { success: false, message: error.message };
  }
}
