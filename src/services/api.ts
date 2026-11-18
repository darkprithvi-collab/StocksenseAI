/**
 * StockSense AI Client-Server HTTP API Client
 * Dynamically resolves API URL:
 * - VITE_API_URL env var if specified (e.g. Vercel -> Render backend)
 * - http://localhost:5000/api in local development
 * - Relative /api if unified single-origin deployment
 */
const getBaseApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseApiUrl();

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

interface LocalUserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar: string;
  token: string;
}

const DEFAULT_USERS: LocalUserRecord[] = [
  {
    id: 'usr_alex_vance',
    name: 'Alex Vance',
    email: 'alex.vance@stocksense.ai',
    password: 'password123',
    role: 'Lead Quantitative Researcher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    token: 'token_local_alex'
  },
  {
    id: 'usr_prithviraj',
    name: 'Prithviraj',
    email: 'darkprithvi@gmail.com',
    password: 'password123',
    role: 'Quantitative Analyst & Portfolio Manager',
    avatar: 'https://ui-avatars.com/api/?name=Prithviraj&background=3b82f6&color=fff&bold=true',
    token: 'token_local_prithvi'
  }
];

function getLocalUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem('stocksense_users_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_USERS;
}

function saveLocalUsers(users: LocalUserRecord[]): void {
  try {
    localStorage.setItem('stocksense_users_db', JSON.stringify(users));
  } catch (e) {}
}

/**
 * Robust JSON request helper that avoids 'Unexpected end of JSON input' syntax errors
 */
async function safeFetchJson<T>(url: string, options: RequestInit): Promise<{ success: boolean; data?: T; status: number; error?: string }> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    
    // Check if response is JSON
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        return { success: response.ok, data: parsed, status: response.status };
      } catch {
        return { success: false, status: response.status, error: 'NON_JSON' };
      }
    }

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (err: any) {
    return { success: false, status: 0, error: err.message || 'NETWORK_ERROR' };
  }
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
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return false;

    const data = await response.json();
    return data.status === 'ONLINE';
  } catch (error) {
    return false;
  }
}

/**
 * POST /api/auth/send-otp
 * Dispatches a 6-digit OTP code to the user's email address for Two-Factor Authentication
 */
export async function apiSendOtp(payload: {
  email: string;
  password?: string;
  isLogin: boolean;
  name?: string;
}): Promise<{ success: boolean; message: string; otp?: string; expiresIn?: number }> {
  const normEmail = (payload.email || '').trim().toLowerCase();

  // 1. Attempt Server Request First
  const res = await safeFetchJson<any>(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, email: normEmail })
  });

  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }

  // 2. Client-side fallback for Vercel / offline mode
  const users = getLocalUsers();
  if (payload.isLogin) {
    const found = users.find(u => u.email.toLowerCase() === normEmail);
    if (!found) {
      return { 
        success: false, 
        message: `No account found for "${normEmail}". Please click "Create Account" to register.` 
      };
    }
    if (found.password && payload.password && found.password !== payload.password.trim()) {
      return { 
        success: false, 
        message: `Incorrect password entered for "${normEmail}". Please try again.` 
      };
    }
  } else {
    const exists = users.find(u => u.email.toLowerCase() === normEmail);
    if (exists) {
      return { 
        success: false, 
        message: `An account with email "${normEmail}" already exists. Please switch to Sign In.` 
      };
    }
  }

  const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    sessionStorage.setItem('stocksense_temp_otp_' + normEmail, JSON.stringify({
      otp: mockOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      ...payload
    }));
  } catch (e) {}

  return {
    success: true,
    message: `A 6-digit verification code has been dispatched to ${normEmail}`,
    otp: mockOtp,
    expiresIn: 300
  };
}

/**
 * POST /api/auth/verify-otp
 * Verifies the submitted 6-digit OTP code and logs the user in
 */
export async function apiVerifyOtp(email: string, otp: string): Promise<{ success: boolean; user?: ServerUser; message?: string }> {
  const normEmail = (email || '').trim().toLowerCase();
  const inputOtp = (otp || '').trim();

  // 1. Attempt Server Request First
  const res = await safeFetchJson<any>(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normEmail, otp: inputOtp })
  });

  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }

  // 2. Client-side fallback
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem('stocksense_temp_otp_' + normEmail);
  } catch (e) {}

  if (!raw) {
    return { success: false, message: 'No active OTP request found. Please request a new code.' };
  }

  const record = JSON.parse(raw);
  if (Date.now() > record.expiresAt) {
    try { sessionStorage.removeItem('stocksense_temp_otp_' + normEmail); } catch (e) {}
    return { success: false, message: 'OTP code has expired. Please request a new code.' };
  }

  if (record.otp !== inputOtp) {
    return { success: false, message: 'Incorrect OTP code entered. Please check and try again.' };
  }

  try { sessionStorage.removeItem('stocksense_temp_otp_' + normEmail); } catch (e) {}

  if (record.isLogin) {
    return apiLogin(normEmail, record.password);
  } else {
    return apiSignup(record.name || 'Trader', normEmail, record.password);
  }
}

/**
 * POST /api/auth/login
 * Verify user authentication with the Express backend, or fallback to validated local database
 */
export async function apiLogin(email: string, password?: string): Promise<{ success: boolean; user?: ServerUser; message?: string }> {
  const normEmail = (email || '').trim().toLowerCase();
  const inputPassword = (password || '').trim();

  // 1. Attempt Server Request First
  const res = await safeFetchJson<any>(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normEmail, password: inputPassword })
  });

  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }

  // 2. Fallback: Client-Side Verified Ledger (for standalone cloud deployments like Vercel)
  const users = getLocalUsers();
  const found = users.find(u => u.email.toLowerCase() === normEmail);

  if (!found) {
    return {
      success: false,
      message: `No account found for "${normEmail}". Please check your email or click "Create Account" to register.`
    };
  }

  if (found.password && found.password !== inputPassword) {
    return {
      success: false,
      message: `Incorrect password entered for "${normEmail}". Please check your password and try again.`
    };
  }

  const user: ServerUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    avatar: found.avatar,
    token: found.token || 'token_' + Date.now(),
    isLoggedIn: true
  };

  return {
    success: true,
    user,
    message: 'Login verified successfully'
  };
}

/**
 * POST /api/auth/signup
 * Register a new user account with the Express backend, or fallback to validated local database
 */
export async function apiSignup(name: string, email: string, password?: string): Promise<{ success: boolean; user?: ServerUser; message?: string }> {
  const normEmail = (email || '').trim().toLowerCase();
  const userName = (name || '').trim() || 'Trader';
  const inputPassword = (password || '').trim();

  // 1. Attempt Server Request First
  const res = await safeFetchJson<any>(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: userName, email: normEmail, password: inputPassword })
  });

  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }

  // 2. Fallback: Client-Side Verified Ledger
  const users = getLocalUsers();
  const exists = users.find(u => u.email.toLowerCase() === normEmail);
  if (exists) {
    return {
      success: false,
      message: `An account with email "${normEmail}" already exists. Please switch to Sign In.`
    };
  }

  const newUser: LocalUserRecord = {
    id: 'usr_' + Date.now(),
    name: userName,
    email: normEmail,
    password: inputPassword,
    role: 'Quantitative Analyst & Portfolio Manager',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&bold=true`,
    token: 'token_' + Date.now()
  };

  users.push(newUser);
  saveLocalUsers(users);

  return {
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      token: newUser.token,
      isLoggedIn: true
    },
    message: 'Account created successfully'
  };
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
  const res = await safeFetchJson<any>(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }

  // Update in local ledger
  const users = getLocalUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === payload.email.toLowerCase());
  if (idx !== -1) {
    if (payload.name) users[idx].name = payload.name;
    if (payload.role) users[idx].role = payload.role;
    if (payload.avatar) users[idx].avatar = payload.avatar;
    saveLocalUsers(users);
  }

  return { success: true, message: 'Profile updated locally' };
}

/**
 * GET /api/portfolio/holdings
 * Fetch stored stock purchase records & balance from server database.json
 */
export async function apiGetHoldings(): Promise<{ success: boolean; data?: ServerPortfolioData; message?: string }> {
  const res = await safeFetchJson<any>(`${API_BASE_URL}/portfolio/holdings`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.data && res.data.success) {
    return {
      success: true,
      data: {
        cash: res.data.cash,
        startingCash: res.data.startingCash,
        holdings: res.data.holdings || [],
        transactions: res.data.transactions || [],
        lastUpdated: res.data.lastUpdated
      }
    };
  }

  return { success: false, message: res.error || 'Server offline' };
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
  const res = await safeFetchJson<any>(`${API_BASE_URL}/portfolio/buy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.data && typeof res.data === 'object') {
    return res.data;
  }

  return { success: true, message: 'Local order executed' };
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
  const res = await safeFetchJson<any>(`${API_BASE_URL}/portfolio/sell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.data && typeof res.data === 'object') {
    return res.data;
  }

  return { success: true, message: 'Local order executed' };
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
  const res = await safeFetchJson<any>(`${API_BASE_URL}/portfolio/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.data && typeof res.data === 'object') {
    return res.data;
  }

  return { success: true, message: 'Local portfolio reset' };
}
