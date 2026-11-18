import React from 'react';
import { useStock } from '../../context/StockContext';
import { Sparkles, ArrowUpRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const TopAIPicks: React.FC = () => {
  const { stocks, setSelectedStockSymbol, openTradeModal } = useStock();

  // Filter top AI rated stocks sorted by confidence
  const topPicks = [...stocks]
    .filter(s => s.aiRating.includes('BUY'))
    .sort((a, b) => b.aiConfidence - a.aiConfidence)
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Top Gemini Quantitative AI Picks
            </h3>
            <p className="text-[11px] text-slate-400">High-conviction algorithmic signals with risk-adjusted asymmetric return</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full font-semibold">
          Model: Gemini 1.5 Quant Pro
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPicks.map((stock) => {
          const upside = Number((((stock.targetPrice - stock.price) / stock.price) * 100).toFixed(1));

          return (
            <div
              key={stock.symbol}
              className="relative p-5 rounded-2xl bg-[#111827] border border-slate-800/90 hover:border-brand-blue/40 transition-all shadow-lg flex flex-col justify-between group overflow-hidden"
            >
              {/* Subtle accent bar on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-brand-blue opacity-80" />

              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-white font-mono tracking-tight">
                        {stock.symbol}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-800">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">{stock.name}</p>
                  </div>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {stock.aiRating}
                  </span>
                </div>

                {/* Price and Target Metric */}
                <div className="mt-4 p-3 rounded-xl bg-[#0B0F19] border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-semibold">Current</p>
                    <p className="text-sm font-mono font-bold text-white">
                      {stock.currency}{stock.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-500 font-semibold">Target Price</p>
                    <div className="flex items-center gap-1 font-mono text-sm font-bold text-emerald-400">
                      <span>{stock.currency}{stock.targetPrice.toFixed(2)}</span>
                      <span className="text-[10px] font-normal text-emerald-300">(+{upside}%)</span>
                    </div>
                  </div>
                </div>

                {/* AI Rationale Snippet */}
                <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {stock.aiInsights.summary}
                </p>

                {/* AI Confidence Meter Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Algorithmic Confidence</span>
                    <span className="text-indigo-400 font-bold font-mono">{stock.aiConfidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-blue to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${stock.aiConfidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => setSelectedStockSymbol(stock.symbol)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Deep Report</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openTradeModal(stock.symbol, 'BUY')}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center justify-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Trade</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
