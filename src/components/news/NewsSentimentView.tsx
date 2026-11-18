import React from 'react';
import { useStock } from '../../context/StockContext';
import { 
  Newspaper, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Filter, 
  ExternalLink,
  Flame,
  Bot
} from 'lucide-react';

export const NewsSentimentView: React.FC = () => {
  const { stocks, setSelectedStockSymbol } = useStock();

  // Aggregate all news headlines from stocks
  const allHeadlines = stocks.flatMap(s => 
    s.aiInsights.sentiment.newsHeadlines.map(h => ({
      ...h,
      stockSymbol: s.symbol,
      stockCurrency: s.currency,
      stockPrice: s.price
    }))
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-fintech-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Newspaper className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              AI Market News & Sentiment Synthesis
            </h1>
            <span className="text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Gemini NLP Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multimodal sentiment extraction scoring news impact against equity price trajectories
          </p>
        </div>
      </div>

      {/* Sector Sentiment Heatmap */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Sector Sentiment Pulse
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Normalized -100 to +100</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-emerald-500/30 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Semiconductors & AI</span>
              <span className="font-mono font-bold text-emerald-400">+84 Bullish</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[84%]" />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Hyperscaler Blackwell CapEx expansions</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-emerald-500/30 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Indian Bluechips (NSE)</span>
              <span className="font-mono font-bold text-emerald-400">+79 Bullish</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[79%]" />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Reliance 5G monetization & Jio IPO value</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-brand-blue/30 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Cloud Software</span>
              <span className="font-mono font-bold text-brand-blue">+72 Bullish</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-blue h-full rounded-full w-[72%]" />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Azure and GCP enterprise Copilot adoption</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-amber-500/30 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Automotive & Clean Tech</span>
              <span className="font-mono font-bold text-amber-400">+48 Neutral</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full w-[48%]" />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Price wars offset by utility energy storage</p>
          </div>
        </div>
      </div>

      {/* Curated AI News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allHeadlines.map((item, idx) => {
          const isPos = item.sentiment === 'positive';
          return (
            <div
              key={`${item.id}-${idx}`}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {item.source} • {item.time}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                      isPos
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.sentiment.toUpperCase()} • {item.impact} Impact
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-white">
                    {item.stockSymbol}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.stockCurrency}{item.stockPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedStockSymbol(item.stockSymbol)}
                  className="text-xs font-semibold text-brand-blue hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <span>Launch Deep Report</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
