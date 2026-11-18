import React, { useState, useRef, useEffect } from 'react';
import { useStock } from '../../context/StockContext';
import { 
  Search, 
  TrendingUp, 
  Bell, 
  Plus, 
  Wallet, 
  ChevronDown, 
  Sparkles,
  Command
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    stocks, 
    setSelectedStockSymbol, 
    cash, 
    totalPortfolioValue, 
    openTradeModal,
    notifications,
    user,
    isServerOnline,
    openProfileModal
  } = useStock();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStocks = query.trim() === '' 
    ? stocks.slice(0, 5) 
    : stocks.filter(s => 
        s.symbol.toLowerCase().includes(query.toLowerCase()) || 
        s.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Global Stock Search */}
      <div className="relative w-80 sm:w-96" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search NVDA, AAPL, TSLA, RELIANCE..."
            className="w-full bg-[#131B2E] border border-slate-700/60 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono font-medium text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#131B2E] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#0d1424] border-b border-slate-800">
              {query ? 'Matching Assets' : 'Popular Equities'}
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleSelect(stock.symbol)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0B0F19] border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-brand-blue group-hover:border-brand-blue">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{stock.symbol}</span>
                          <span className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">{stock.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{stock.exchange}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-semibold text-white">
                        {stock.currency}{stock.price.toFixed(2)}
                      </div>
                      <div className={`text-[10px] font-mono font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching tickers found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Server-Side Backend Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isServerOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isServerOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-mono text-[10px] font-semibold text-slate-200">
            {isServerOnline ? 'Backend :5000 Active' : 'Connecting Server...'}
          </span>
        </div>

        {/* Live Feed Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Market Feeds Active</span>
        </div>

        {/* Available Virtual Cash Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#131B2E] border border-slate-800">
          <Wallet className="w-4 h-4 text-brand-blue" />
          <div className="text-left">
            <p className="text-[10px] text-slate-400 leading-none">Buying Power</p>
            <p className="text-xs font-mono font-bold text-white mt-0.5">
              ${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Quick Trade Button */}
        <button
          onClick={() => openTradeModal('NVDA', 'BUY')}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl bg-[#131B2E] border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-blue" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-[#131B2E] border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
              <div className="text-xs font-bold text-white pb-2 border-b border-slate-800 flex justify-between items-center">
                <span>Recent System Alerts</span>
                <span className="text-[10px] text-slate-400">{notifications.length} alerts</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto mt-1">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="py-2 text-left">
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Settings */}
        <button
          onClick={openProfileModal}
          title="Click to Edit Profile"
          className="flex items-center gap-2 pl-2.5 py-1 pr-1.5 rounded-xl bg-[#131B2E] border border-slate-800 hover:border-brand-blue/50 transition-all text-left group"
        >
          <div className="hidden lg:block text-right">
            <p className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors leading-tight">
              {user.name || 'User Profile'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono leading-tight">
              {user.email || 'Personal Account'}
            </p>
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 group-hover:ring-brand-blue"
          />
        </button>
      </div>
    </header>
  );
};
