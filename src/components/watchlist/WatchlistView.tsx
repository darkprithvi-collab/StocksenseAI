import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Zap, 
  Sparkles,
  Check
} from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const { 
    stocks, 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    setSelectedStockSymbol, 
    openTradeModal 
  } = useStock();

  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState('');

  // Watched stocks list
  const watchedStocks = stocks.filter(s => watchlist.includes(s.symbol));
  
  // Filtered by search in table
  const displayedStocks = watchedStocks.filter(s => 
    s.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Available stocks to add
  const availableToAdd = stocks.filter(s => 
    !watchlist.includes(s.symbol) &&
    (s.symbol.toLowerCase().includes(addSearch.toLowerCase()) || s.name.toLowerCase().includes(addSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-fintech-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue">
              <Bookmark className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Dynamic Watchlist Tracker
            </h1>
            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              {watchedStocks.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time quantitative tracking with automated Gemini sentiment scans and instant virtual execution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter watchlist..."
              className="bg-[#0B0F19] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ticker</span>
          </button>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl shadow-fintech-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0d1424] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-4">Market Price</th>
                <th className="py-3.5 px-4">24H Change</th>
                <th className="py-3.5 px-4 hidden md:table-cell">52W Range</th>
                <th className="py-3.5 px-4">AI Conviction</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">7D Trend</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {displayedStocks.length > 0 ? (
                displayedStocks.map((stock) => {
                  const isPos = stock.change >= 0;
                  const range52 = stock.week52High - stock.week52Low || 1;
                  const pos52 = Math.min(100, Math.max(0, ((stock.price - stock.week52Low) / range52) * 100));

                  // Sparkline svg points
                  const min = Math.min(...stock.sparkline);
                  const max = Math.max(...stock.sparkline);
                  const sRange = max - min || 1;
                  const sparkPoints = stock.sparkline
                    .map((val, idx) => {
                      const x = (idx / (stock.sparkline.length - 1)) * 70;
                      const y = 20 - ((val - min) / sRange) * 16;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <tr 
                      key={stock.symbol}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Asset & Ticker */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedStockSymbol(stock.symbol)}
                            className="w-8 h-8 rounded-xl bg-[#0B0F19] border border-slate-700 font-mono font-black text-xs text-brand-blue flex items-center justify-center group-hover:border-brand-blue transition-colors"
                          >
                            {stock.symbol.slice(0, 2)}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span 
                                onClick={() => setSelectedStockSymbol(stock.symbol)}
                                className="font-bold text-white hover:text-brand-blue cursor-pointer transition-colors"
                              >
                                {stock.symbol}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {stock.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {stock.currency}{stock.price.toFixed(2)}
                      </td>

                      {/* 24H Change */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                            isPos 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPos ? '+' : ''}{stock.change.toFixed(2)} ({isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </td>

                      {/* 52W Range */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                            <span>{stock.week52Low}</span>
                            <span>{stock.week52High}</span>
                          </div>
                          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-blue rounded-full"
                              style={{ width: `${pos52}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* AI Conviction */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className={`inline-block w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            stock.aiRating.includes('BUY')
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {stock.aiRating}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-mono mt-0.5">
                            {stock.aiConfidence}% Conviction
                          </span>
                        </div>
                      </td>

                      {/* 7D Trend */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <div className="w-20 h-6">
                          <svg viewBox="0 0 70 22" className="w-full h-full overflow-visible">
                            <polyline
                              fill="none"
                              stroke={isPos ? '#10b981' : '#ef4444'}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={sparkPoints}
                            />
                          </svg>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStockSymbol(stock.symbol)}
                            title="Inspect Gemini AI Report"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openTradeModal(stock.symbol, 'BUY')}
                            title="Quick Virtual Trade"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(stock.symbol)}
                            title="Remove from Watchlist"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No matching stocks in your watchlist. Click &quot;Add Ticker&quot; to populate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Ticker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-brand-blue" />
                <h3 className="text-sm font-bold text-white">Add Stock to Watchlist</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                placeholder="Search stocks to add..."
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
              {availableToAdd.length > 0 ? (
                availableToAdd.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-white">{stock.symbol}</span>
                        <span className="text-[10px] text-slate-400">{stock.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{stock.currency}{stock.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => {
                        addToWatchlist(stock.symbol);
                        if (availableToAdd.length <= 1) setShowAddModal(false);
                      }}
                      className="px-2.5 py-1 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  {stocks.length === watchlist.length
                    ? 'All available assets are already in your active watchlist!'
                    : 'No matching stocks found.'}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
