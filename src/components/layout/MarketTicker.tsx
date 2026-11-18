import React from 'react';
import { useStock } from '../../context/StockContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  const { marketIndices, stocks, setSelectedStockSymbol } = useStock();

  return (
    <div className="bg-[#080C14] border-b border-slate-800/80 overflow-hidden py-1.5 px-4">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
        {/* Market Indices */}
        {marketIndices.map((idx) => {
          const isPos = !idx.change.startsWith('-');
          return (
            <div key={idx.symbol} className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-slate-300">{idx.name}</span>
              <span className="font-mono text-slate-100">{idx.price}</span>
              <span className={`inline-flex items-center text-[11px] font-mono font-medium ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}

        <div className="h-3 w-px bg-slate-800 shrink-0" />

        {/* Featured Stocks */}
        {stocks.slice(0, 4).map((stock) => {
          const isPos = stock.change >= 0;
          return (
            <button
              key={stock.symbol}
              onClick={() => setSelectedStockSymbol(stock.symbol)}
              className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="font-bold text-slate-200">{stock.symbol}</span>
              <span className="font-mono text-slate-300">{stock.currency}{stock.price.toFixed(2)}</span>
              <span className={`text-[11px] font-mono ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
