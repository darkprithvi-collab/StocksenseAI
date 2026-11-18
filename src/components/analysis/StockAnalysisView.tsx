import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
import { GeminiAIReport } from './GeminiAIReport';
import { TimeFrame } from '../../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Plus, 
  Minus, 
  Activity, 
  Layers, 
  BarChart, 
  Building,
  Check,
  ShieldCheck
} from 'lucide-react';

export const StockAnalysisView: React.FC = () => {
  const { 
    stocks, 
    selectedStock, 
    setSelectedStockSymbol, 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    openTradeModal 
  } = useStock();

  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');

  const isPositive = selectedStock.change >= 0;
  const isWatched = watchlist.includes(selectedStock.symbol);
  const chartData = selectedStock.chartData[timeframe] || selectedStock.chartData['1M'];
  const gradientColor = isPositive ? '#10b981' : '#ef4444';

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  // Calculate 52-week position percentage
  const range52 = selectedStock.week52High - selectedStock.week52Low || 1;
  const pos52 = Math.min(100, Math.max(0, ((selectedStock.price - selectedStock.week52Low) / range52) * 100));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Quick Stock Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-2 bg-[#111827] rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-[11px] font-bold uppercase text-slate-500 px-2 shrink-0">Tickers:</span>
          {stocks.map((stock) => {
            const isSelected = stock.symbol === selectedStock.symbol;
            return (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStockSymbol(stock.symbol)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                    : 'bg-[#131B2E] text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{stock.symbol}</span>
                <span className={`text-[10px] ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Watchlist Star Toggle */}
        <button
          onClick={() => {
            if (isWatched) {
              removeFromWatchlist(selectedStock.symbol);
            } else {
              addToWatchlist(selectedStock.symbol);
            }
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isWatched
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-[#131B2E] border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-amber-400' : ''}`} />
          <span>{isWatched ? 'In Watchlist' : 'Add to Watchlist'}</span>
        </button>
      </div>

      {/* 2. Stock Detailed Hero Card */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-fintech-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Identity & Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white font-mono tracking-tight">
                {selectedStock.symbol}
              </h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {selectedStock.exchange}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedStock.sector}
              </span>
            </div>
            <p className="text-sm text-slate-400">{selectedStock.name}</p>

            <div className="flex items-baseline gap-4 pt-1">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {selectedStock.currency}{selectedStock.price.toFixed(2)}
              </span>
              <div className={`flex items-center gap-1 font-mono text-base font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span>{isPositive ? '+' : ''}{selectedStock.change.toFixed(2)} ({isPositive ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Buy/Sell Buttons & 52-Week Range Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* 52-Week Range Widget */}
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 uppercase font-semibold">
                <span>52W Low: {selectedStock.currency}{selectedStock.week52Low}</span>
                <span>52W High: {selectedStock.currency}{selectedStock.week52High}</span>
              </div>
              <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-blue to-emerald-400 rounded-full"
                  style={{ width: `${pos52}%` }}
                />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono">Position in 52W: {pos52.toFixed(0)}%</span>
              </div>
            </div>

            {/* Quick Virtual Trading Execution Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => openTradeModal(selectedStock.symbol, 'BUY')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>BUY {selectedStock.symbol}</span>
              </button>
              <button
                onClick={() => openTradeModal(selectedStock.symbol, 'SELL')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 font-bold text-xs border border-slate-700 hover:border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Minus className="w-4 h-4" />
                <span>SELL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fundamental Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Market Cap</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedStock.marketCap}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500">P/E Ratio</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedStock.peRatio}x</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Beta (Volatility)</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedStock.beta}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Day Volume</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedStock.volume}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Day High</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedStock.currency}{selectedStock.high}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Day Low</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">{selectedStock.currency}{selectedStock.low}</p>
          </div>
        </div>

        {/* Technical Chart */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Technical Price Chart ({timeframe})
            </span>
            <div className="flex p-1 bg-[#0B0F19] rounded-xl border border-slate-800">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-slate-800 text-brand-blue font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`detail-grad-${selectedStock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={gradientColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  domain={['auto', 'auto']} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${selectedStock.currency}${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#131B2E] border border-slate-700 p-3 rounded-xl shadow-2xl">
                          <p className="text-[11px] text-slate-400 font-mono">{d.time}</p>
                          <p className="text-sm font-bold text-white font-mono mt-0.5">
                            {selectedStock.currency}{d.price?.toFixed(2)}
                          </p>
                          {d.rsi && <p className="text-[10px] text-indigo-400 font-mono">RSI: {d.rsi}</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={gradientColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#detail-grad-${selectedStock.symbol})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. The Flagship Gemini AI Insights Report */}
      <GeminiAIReport stock={selectedStock} />
    </div>
  );
};
