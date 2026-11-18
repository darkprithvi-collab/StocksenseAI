import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
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
import { TrendingUp, TrendingDown, Maximize2, Zap, BrainCircuit } from 'lucide-react';

export const InteractiveMainChart: React.FC = () => {
  const { stocks, selectedStock, setSelectedStockSymbol, setActiveTab } = useStock();
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [activeStockSymbol, setActiveStockSymbol] = useState<string>('NVDA');

  const activeStock = stocks.find(s => s.symbol === activeStockSymbol) || selectedStock;
  const chartData = activeStock.chartData[timeframe] || activeStock.chartData['1D'];

  const isPositive = activeStock.change >= 0;
  const gradientColor = isPositive ? '#10b981' : '#ef4444';

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-fintech-card space-y-4">
      {/* Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Stock Selector Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['NVDA', 'AAPL', 'RELIANCE', 'TSLA'].map((sym) => {
            const isSelected = activeStockSymbol === sym;
            const stockItem = stocks.find(s => s.symbol === sym);
            return (
              <button
                key={sym}
                onClick={() => setActiveStockSymbol(sym)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                    : 'bg-[#131B2E] text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{sym}</span>
                {stockItem && (
                  <span className={`text-[10px] ${stockItem.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stockItem.change >= 0 ? '+' : ''}{stockItem.changePercent.toFixed(1)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Timeframe Buttons & Deep Analysis Jump */}
        <div className="flex items-center gap-2">
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

          <button
            onClick={() => {
              setSelectedStockSymbol(activeStock.symbol);
              setActiveTab('analysis');
            }}
            title="Open Deep Gemini AI Analysis"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Report</span>
          </button>
        </div>
      </div>

      {/* Stock Live Header on Chart */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-black text-white font-mono tracking-tight">
            {activeStock.currency}{activeStock.price.toFixed(2)}
          </h2>
          <div className={`flex items-center gap-1 font-mono text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? '+' : ''}{activeStock.change.toFixed(2)} ({isPositive ? '+' : ''}{activeStock.changePercent.toFixed(2)}%)</span>
          </div>
          <span className="text-xs text-slate-500 hidden md:inline">
            Vol: {activeStock.volume} • MCap: {activeStock.marketCap}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">AI Conviction:</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {activeStock.aiRating} ({activeStock.aiConfidence}%)
          </span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${activeStock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.35} />
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
              tickFormatter={(val) => `${activeStock.currency}${val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#131B2E] border border-slate-700 p-3 rounded-xl shadow-2xl">
                      <p className="text-[11px] text-slate-400 font-mono">{data.time}</p>
                      <p className="text-sm font-bold text-white font-mono mt-0.5">
                        {activeStock.currency}{data.price?.toFixed(2)}
                      </p>
                      {data.volume && (
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          Vol: {data.volume.toLocaleString()}
                        </p>
                      )}
                      {data.rsi && (
                        <p className="text-[10px] text-indigo-400 font-mono">
                          RSI: {data.rsi}
                        </p>
                      )}
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
              fill={`url(#gradient-${activeStock.symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
