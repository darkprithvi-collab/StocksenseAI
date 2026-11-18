import React from 'react';
import { useStock } from '../../context/StockContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketOverview: React.FC = () => {
  const { marketIndices } = useStock();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketIndices.slice(0, 4).map((idx) => {
        const isPos = !idx.change.startsWith('-');
        const minVal = Math.min(...idx.sparkline);
        const maxVal = Math.max(...idx.sparkline);
        const range = maxVal - minVal || 1;

        // Generate simple SVG path for sparkline
        const points = idx.sparkline
          .map((val, i) => {
            const x = (i / (idx.sparkline.length - 1)) * 90 + 5;
            const y = 35 - ((val - minVal) / range) * 25;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <div
            key={idx.symbol}
            className="p-4 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{idx.name}</p>
                <h3 className="text-xl font-extrabold text-white font-mono mt-1 tracking-tight">
                  {idx.price}
                </h3>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                  isPos 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </span>
            </div>

            {/* Sparkline & Range */}
            <div className="mt-4 flex items-end justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {idx.change} pts today
              </span>
              <div className="w-24 h-9">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke={isPos ? '#10b981' : '#ef4444'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
