import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';

export const HotMovers: React.FC = () => {
  const { stocks, setSelectedStockSymbol } = useStock();
  const [tab, setTab] = useState<'gainers' | 'losers'>('gainers');

  const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

  const displayed = tab === 'gainers' ? gainers : losers;

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Market Movers
            </h3>
          </div>

          <div className="flex p-1 bg-[#0B0F19] rounded-xl border border-slate-800">
            <button
              onClick={() => setTab('gainers')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                tab === 'gainers'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gainers
            </button>
            <button
              onClick={() => setTab('losers')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                tab === 'losers'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Losers
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 divide-y divide-slate-800/60">
          {displayed.map((stock) => {
            const isPos = stock.change >= 0;
            return (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStockSymbol(stock.symbol)}
                className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs text-white group-hover:text-brand-blue transition-colors">
                    {stock.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[110px] hidden sm:inline">
                    {stock.name}
                  </span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-200">
                    {stock.currency}{stock.price.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
        Real-time price feed refreshed every 4.5s
      </div>
    </div>
  );
};
