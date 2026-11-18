import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Stock, 
  User, 
  PortfolioHolding, 
  Transaction, 
  ToastNotification, 
  ActiveTab,
  MarketIndex 
} from '../types';
import { INITIAL_STOCKS, MARKET_INDICES } from '../data/mockStocks';
import { 
  checkServerHealth, 
  apiLogin, 
  apiSignup,
  apiForgotPassword,
  apiResetPassword,
  apiUpdateProfile, 
  apiGetHoldings, 
  apiBuyStock, 
  apiSellStock, 
  apiResetPortfolio 
} from '../services/api';

interface TradeModalConfig {
  isOpen: boolean;
  symbol: string;
  defaultType: 'BUY' | 'SELL';
}

interface StockContextType {
  // Auth
  user: User;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Server-Side Status
  isServerOnline: boolean;
  serverUrl: string;

  // Stocks data & live tick
  stocks: Stock[];
  marketIndices: MarketIndex[];
  selectedStock: Stock;
  setSelectedStockSymbol: (symbol: string) => void;
  getStock: (symbol: string) => Stock | undefined;
  
  // Watchlist
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;

  // Virtual Trading & Portfolio
  cash: number;
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  totalPortfolioValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  buyStock: (symbol: string, shares: number) => { success: boolean; message: string };
  sellStock: (symbol: string, shares: number) => { success: boolean; message: string };
  resetPortfolio: () => void;

  // Trade Modal
  tradeModal: TradeModalConfig;
  openTradeModal: (symbol: string, defaultType?: 'BUY' | 'SELL') => void;
  closeTradeModal: () => void;

  // Toast Alerts
  notifications: ToastNotification[];
  addNotification: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeNotification: (id: string) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Profile Modal & Updates
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  updateUserProfile: (updates: { name?: string; role?: string; avatar?: string }) => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const INITIAL_USER: User = {
  name: 'Alex Vance',
  email: 'alex.vance@stocksense.ai',
  role: 'Lead Quantitative Researcher (Client-Server Verified)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  isLoggedIn: false
};

const DEFAULT_WATCHLIST = ['NVDA', 'AAPL', 'RELIANCE', 'MSFT', 'GOOGL'];

const DEFAULT_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 15,
    avgBuyPrice: 124.50,
    currentPrice: 138.25,
    totalValue: 15 * 138.25,
    totalReturn: 15 * (138.25 - 124.50),
    totalReturnPercent: ((138.25 - 124.50) / 124.50) * 100,
    sector: 'Semiconductors & AI'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 20,
    avgBuyPrice: 215.00,
    currentPrice: 228.40,
    totalValue: 20 * 228.40,
    totalReturn: 20 * (228.40 - 215.00),
    totalReturnPercent: ((228.40 - 215.00) / 215.00) * 100,
    sector: 'Consumer Electronics'
  }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'BUY',
    shares: 15,
    price: 124.50,
    total: 1867.50,
    timestamp: '2026-11-02 10:14:32'
  },
  {
    id: 'tx-2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'BUY',
    shares: 20,
    price: 215.00,
    total: 4300.00,
    timestamp: '2026-11-02 11:35:10'
  }
];

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Server status state
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);
  const serverUrl = 'http://localhost:5000';

  // Auth state with local storage fallback
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('stocksense_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>(MARKET_INDICES);
  const [selectedStockSymbol, setSelectedStockSymbolState] = useState<string>('NVDA');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stocksense_watchlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_WATCHLIST;
  });

  // Virtual Portfolio state
  const [cash, setCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('stocksense_cash');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return 3832.50;
  });

  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    try {
      const saved = localStorage.getItem('stocksense_holdings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_HOLDINGS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('stocksense_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_TRANSACTIONS;
  });

  // Trade modal state
  const [tradeModal, setTradeModal] = useState<TradeModalConfig>({
    isOpen: false,
    symbol: 'NVDA',
    defaultType: 'BUY'
  });

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // Notifications
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('stocksense_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('stocksense_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('stocksense_cash', JSON.stringify(cash));
  }, [cash]);

  useEffect(() => {
    localStorage.setItem('stocksense_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('stocksense_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Initial connection to Express Backend (Port 5000)
  useEffect(() => {
    let isMounted = true;

    const connectToServer = async () => {
      const online = await checkServerHealth();
      if (!isMounted) return;
      setIsServerOnline(online);

      if (online) {
        console.log('[StockSense Client] Connected to Express Backend on Port 5000');
        const holdingsRes = await apiGetHoldings();
        if (holdingsRes.success && holdingsRes.data && isMounted) {
          setCash(holdingsRes.data.cash);
          
          // Reconcile holdings with live market prices
          const mappedHoldings: PortfolioHolding[] = holdingsRes.data.holdings.map(h => {
            const liveStock = stocks.find(s => s.symbol.toUpperCase() === h.symbol.toUpperCase());
            const currPrice = liveStock ? liveStock.price : h.avgBuyPrice;
            const totalVal = h.shares * currPrice;
            const totReturn = totalVal - (h.shares * h.avgBuyPrice);
            const totReturnPct = ((currPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100;

            return {
              symbol: h.symbol,
              name: h.name,
              shares: h.shares,
              avgBuyPrice: h.avgBuyPrice,
              currentPrice: currPrice,
              totalValue: Number(totalVal.toFixed(2)),
              totalReturn: Number(totReturn.toFixed(2)),
              totalReturnPercent: Number(totReturnPct.toFixed(2)),
              sector: h.sector || 'Equities'
            };
          });

          setHoldings(mappedHoldings);
          if (holdingsRes.data.transactions && holdingsRes.data.transactions.length > 0) {
            setTransactions(holdingsRes.data.transactions);
          }
        }
      }
    };

    connectToServer();

    // Periodic heartbeat every 8 seconds
    const heartbeat = setInterval(async () => {
      const online = await checkServerHealth();
      if (isMounted) setIsServerOnline(online);
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(heartbeat);
    };
  }, []);

  // Simulated live market price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          if (Math.random() > 0.4) return stock;
          const delta = (Math.random() - 0.48) * (stock.price * 0.0015);
          const newPrice = Number((stock.price + delta).toFixed(2));
          const newChange = Number((stock.change + delta).toFixed(2));
          const newChangePercent = Number(((newChange / (stock.price - stock.change)) * 100).toFixed(2));

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent
          };
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Update holdings currentPrice whenever stocks update
  useEffect(() => {
    setHoldings(prevHoldings => {
      return prevHoldings.map(h => {
        const liveStock = stocks.find(s => s.symbol === h.symbol);
        const currPrice = liveStock ? liveStock.price : h.currentPrice;
        const totalVal = h.shares * currPrice;
        const totReturn = totalVal - (h.shares * h.avgBuyPrice);
        const totReturnPct = ((currPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100;

        return {
          ...h,
          currentPrice: currPrice,
          totalValue: Number(totalVal.toFixed(2)),
          totalReturn: Number(totReturn.toFixed(2)),
          totalReturnPercent: Number(totReturnPct.toFixed(2))
        };
      });
    });
  }, [stocks]);

  // Selected Stock
  const selectedStock = useMemo(() => {
    const found = stocks.find(s => s.symbol.toUpperCase() === selectedStockSymbol.toUpperCase());
    return found || stocks[0];
  }, [stocks, selectedStockSymbol]);

  const setSelectedStockSymbol = (symbol: string) => {
    setSelectedStockSymbolState(symbol);
    setActiveTab('analysis');
  };

  const getStock = (symbol: string) => {
    return stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  };

  // Auth actions with Backend Verification
  const login = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const userEmail = (email || '').trim().toLowerCase();
    const userPassword = (password || '').trim();

    if (!userEmail || !userPassword) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    try {
      const serverRes = await apiLogin(userEmail, userPassword);
      if (serverRes.success && serverRes.user) {
        setUser(serverRes.user);
        localStorage.setItem('stocksense_user', JSON.stringify(serverRes.user));
        setActiveTab('dashboard');
        addNotification('Server Login Verified', `Welcome ${serverRes.user.name}! Signed in as ${serverRes.user.email}`, 'success');
        return { success: true, message: 'Login successful' };
      }
      const errMsg = serverRes.message || 'Authentication failed.';
      addNotification('Login Failed', errMsg, 'error');
      return { success: false, message: errMsg };
    } catch (e: any) {
      const errMsg = e.message || 'Unable to connect to authentication server.';
      addNotification('Login Error', errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const signup = async (name: string, email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const userEmail = (email || '').trim().toLowerCase();
    const userName = (name || '').trim() || 'Trader';
    const userPassword = (password || '').trim();

    if (!userEmail || !userPassword) {
      return { success: false, message: 'Full name, email, and password are required.' };
    }

    try {
      const serverRes = await apiSignup(userName, userEmail, userPassword);
      if (serverRes.success && serverRes.user) {
        setUser(serverRes.user);
        localStorage.setItem('stocksense_user', JSON.stringify(serverRes.user));
        setActiveTab('dashboard');
        addNotification('Account Created', `Welcome ${serverRes.user.name}! Profile registered into server/database.json`, 'success');
        return { success: true, message: 'Account created successfully' };
      }
      const errMsg = serverRes.message || 'Registration failed.';
      addNotification('Signup Failed', errMsg, 'error');
      return { success: false, message: errMsg };
    } catch (e: any) {
      const errMsg = e.message || 'Unable to connect to authentication server.';
      addNotification('Signup Error', errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiForgotPassword(email);
      if (res.success) {
        addNotification('Reset Code Sent', res.message, 'info');
        return { success: true, message: res.message };
      }
      addNotification('Request Failed', res.message, 'error');
      return { success: false, message: res.message };
    } catch (e: any) {
      const errMsg = e.message || 'Failed to dispatch password reset code.';
      addNotification('Error', errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiResetPassword(email, otp, newPassword);
      if (res.success) {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('stocksense_user', JSON.stringify(res.user));
          setActiveTab('dashboard');
        }
        addNotification('Password Reset Successful', res.message, 'success');
        return { success: true, message: res.message };
      }
      addNotification('Reset Failed', res.message, 'error');
      return { success: false, message: res.message };
    } catch (e: any) {
      const errMsg = e.message || 'Failed to reset password.';
      addNotification('Error', errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const updateUserProfile = async (updates: { name?: string; role?: string; avatar?: string }) => {
    const updatedUser: User = {
      ...user,
      ...updates
    };
    setUser(updatedUser);
    localStorage.setItem('stocksense_user', JSON.stringify(updatedUser));
    if (user.email) {
      await apiUpdateProfile({ email: user.email, ...updates });
    }
    addNotification('Profile Updated', `Profile updated to ${updatedUser.name} and saved to server/database.json`, 'success');
  };

  const logout = () => {
    localStorage.removeItem('stocksense_user');
    setUser(prev => ({
      ...prev,
      name: '',
      email: '',
      isLoggedIn: false
    }));
    addNotification('Logged Out', 'You have been signed out. Please enter your personal email to continue.', 'info');
  };

  // Watchlist methods
  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
      addNotification('Watchlist Updated', `Added ${symbol} to your active watchlist`, 'info');
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    addNotification('Watchlist Updated', `Removed ${symbol} from watchlist`, 'info');
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };

  // Portfolio calculations
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalPortfolioValue = Number((cash + totalHoldingsValue).toFixed(2));
  const totalInvested = Number(holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0).toFixed(2));
  const totalProfitLoss = Number((totalHoldingsValue - totalInvested).toFixed(2));
  const totalProfitLossPercent = totalInvested > 0 ? Number(((totalProfitLoss / totalInvested) * 100).toFixed(2)) : 0;

  // Trading action: BUY STOCK with Server-Side Permanent Ledger Write
  const buyStock = (symbol: string, shares: number): { success: boolean; message: string } => {
    const stock = getStock(symbol);
    if (!stock) return { success: false, message: 'Stock not found' };
    if (shares <= 0 || !Number.isInteger(shares)) {
      return { success: false, message: 'Please enter a valid positive whole number of shares' };
    }

    const totalCost = Number((stock.price * shares).toFixed(2));
    if (totalCost > cash) {
      addNotification('Order Failed', `Insufficient buying power! Needed: $${totalCost.toLocaleString()}, Available: $${cash.toLocaleString()}`, 'error');
      return { success: false, message: `Insufficient cash! Need $${totalCost.toLocaleString()}, have $${cash.toLocaleString()}` };
    }

    // 1. Asynchronously send POST /api/portfolio/buy to Server
    apiBuyStock({
      symbol: stock.symbol,
      name: stock.name,
      shares,
      price: stock.price,
      sector: stock.sector
    }).then(serverRes => {
      if (serverRes.success && serverRes.cash !== undefined && serverRes.holdings) {
        setCash(serverRes.cash);
        if (serverRes.transaction) {
          setTransactions(prev => [serverRes.transaction!, ...prev.filter(t => t.id !== serverRes.transaction!.id)]);
        }
      }
    }).catch(err => {
      console.warn('Backend server buy sync note:', err.message);
    });

    // 2. Immediate responsive UI update
    setCash(prev => Number((prev - totalCost).toFixed(2)));

    setHoldings(prevHoldings => {
      const existing = prevHoldings.find(h => h.symbol === symbol);
      if (existing) {
        const newTotalShares = existing.shares + shares;
        const newTotalCost = (existing.shares * existing.avgBuyPrice) + totalCost;
        const newAvgPrice = Number((newTotalCost / newTotalShares).toFixed(2));
        const newTotalVal = Number((newTotalShares * stock.price).toFixed(2));
        const newReturn = Number((newTotalVal - newTotalCost).toFixed(2));

        return prevHoldings.map(h => h.symbol === symbol ? {
          ...h,
          shares: newTotalShares,
          avgBuyPrice: newAvgPrice,
          currentPrice: stock.price,
          totalValue: newTotalVal,
          totalReturn: newReturn,
          totalReturnPercent: Number(((newReturn / newTotalCost) * 100).toFixed(2))
        } : h);
      } else {
        return [
          ...prevHoldings,
          {
            symbol: stock.symbol,
            name: stock.name,
            shares: shares,
            avgBuyPrice: stock.price,
            currentPrice: stock.price,
            totalValue: totalCost,
            totalReturn: 0,
            totalReturnPercent: 0,
            sector: stock.sector
          }
        ];
      }
    });

    // Record local transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      symbol: stock.symbol,
      name: stock.name,
      type: 'BUY',
      shares: shares,
      price: stock.price,
      total: totalCost,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setTransactions(prev => [newTx, ...prev]);

    // Viva celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#3b82f6', '#06b6d4']
      });
    } catch (e) {
      // ignore
    }

    addNotification('Order Executed', `Bought ${shares} shares of ${stock.symbol} @ ${stock.currency}${stock.price} (Saved to server/database.json)`, 'trade');
    return { success: true, message: `Successfully purchased ${shares} shares of ${stock.symbol}` };
  };

  // Trading action: SELL STOCK with Server-Side Permanent Ledger Write
  const sellStock = (symbol: string, shares: number): { success: boolean; message: string } => {
    const stock = getStock(symbol);
    if (!stock) return { success: false, message: 'Stock not found' };
    if (shares <= 0 || !Number.isInteger(shares)) {
      return { success: false, message: 'Please enter a valid positive whole number of shares' };
    }

    const existing = holdings.find(h => h.symbol === symbol);
    if (!existing || existing.shares < shares) {
      addNotification('Order Failed', `You only hold ${existing?.shares || 0} shares of ${symbol}. Cannot sell ${shares}.`, 'error');
      return { success: false, message: `Insufficient shares! You own ${existing?.shares || 0} shares.` };
    }

    const totalProceeds = Number((stock.price * shares).toFixed(2));
    
    // 1. Asynchronously send POST /api/portfolio/sell to Server
    apiSellStock({
      symbol: stock.symbol,
      shares,
      price: stock.price
    }).then(serverRes => {
      if (serverRes.success && serverRes.cash !== undefined) {
        setCash(serverRes.cash);
      }
    }).catch(err => {
      console.warn('Backend server sell sync note:', err.message);
    });

    // 2. Immediate responsive UI update
    setCash(prev => Number((prev + totalProceeds).toFixed(2)));

    setHoldings(prevHoldings => {
      return prevHoldings
        .map(h => {
          if (h.symbol !== symbol) return h;
          const remainingShares = h.shares - shares;
          if (remainingShares === 0) return null;
          const totalVal = Number((remainingShares * stock.price).toFixed(2));
          const totalCost = remainingShares * h.avgBuyPrice;
          const totalRet = Number((totalVal - totalCost).toFixed(2));
          return {
            ...h,
            shares: remainingShares,
            currentPrice: stock.price,
            totalValue: totalVal,
            totalReturn: totalRet,
            totalReturnPercent: Number(((totalRet / totalCost) * 100).toFixed(2))
          };
        })
        .filter((h): h is PortfolioHolding => h !== null);
    });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      symbol: stock.symbol,
      name: stock.name,
      type: 'SELL',
      shares: shares,
      price: stock.price,
      total: totalProceeds,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setTransactions(prev => [newTx, ...prev]);

    addNotification('Order Executed', `Sold ${shares} shares of ${stock.symbol} @ ${stock.currency}${stock.price} (Updated server/database.json)`, 'trade');
    return { success: true, message: `Successfully sold ${shares} shares of ${stock.symbol}` };
  };

  // Reset portfolio on server and client
  const resetPortfolio = () => {
    apiResetPortfolio().catch(() => {});
    setCash(10000.00);
    setHoldings([]);
    setTransactions([]);
    addNotification('Portfolio Reset', 'Virtual balance restored to $10,000.00 on Express Server & Client', 'info');
  };

  // Trade Modal
  const openTradeModal = (symbol: string, defaultType: 'BUY' | 'SELL' = 'BUY') => {
    setTradeModal({
      isOpen: true,
      symbol,
      defaultType
    });
  };

  const closeTradeModal = () => {
    setTradeModal(prev => ({ ...prev, isOpen: false }));
  };

  // Toast notifications
  const addNotification = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const newNotif: ToastNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <StockContext.Provider
      value={{
        user,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout,
        activeTab,
        setActiveTab,
        isServerOnline,
        serverUrl,
        stocks,
        marketIndices,
        selectedStock,
        setSelectedStockSymbol,
        getStock,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        cash,
        holdings,
        transactions,
        totalPortfolioValue,
        totalInvested,
        totalProfitLoss,
        totalProfitLossPercent,
        buyStock,
        sellStock,
        resetPortfolio,
        tradeModal,
        openTradeModal,
        closeTradeModal,
        notifications,
        addNotification,
        removeNotification,
        searchQuery,
        setSearchQuery,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        updateUserProfile
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
