import React from 'react';
import { Gauge, ShieldAlert, TrendingUp, Info } from 'lucide-react';

export const MarketSentimentGauge: React.FC = () => {
  const sentimentScore = 74; // Greed / Bullish

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Gauge className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Market Sentiment & Regime
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            BULLISH BIAS
          </span>
        </div>

        {/* Gauge Metric */}
        <div className="mt-5 text-center">
          <div className="inline-block relative">
            <span className="text-4xl font-black text-white font-mono tracking-tight">
              {sentimentScore}
            </span>
            <span className="text-sm text-slate-400 font-mono">/100</span>
          </div>
          <p className="text-xs font-semibold text-emerald-400 mt-1">
            Greed & Positive Accumulation
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
            Institutional liquidity flow models indicate sustained risk-on appetite across semiconductor and cloud infrastructure equities.
          </p>
        </div>

        {/* Progress meter */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 Extreme Fear</span>
            <span>50 Neutral</span>
            <span>100 Extreme Greed</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-rose-500 w-1/4" />
            <div className="h-full bg-amber-500 w-1/4" />
            <div className="h-full bg-emerald-500 w-1/4" />
            <div className="h-full bg-teal-400 w-1/4" />
          </div>
          {/* Indicator pin */}
          <div className="relative w-full">
            <div
              className="absolute -top-1 w-2.5 h-2.5 bg-white border-2 border-emerald-500 rounded-full shadow-md -translate-x-1/2"
              style={{ left: `${sentimentScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
          <span className="text-slate-400 text-[10px] uppercase font-semibold">CBOE VIX</span>
          <p className="font-mono font-bold text-white text-sm mt-0.5">14.82</p>
          <span className="text-[10px] text-emerald-400 font-medium">Low Volatility</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80">
          <span className="text-slate-400 text-[10px] uppercase font-semibold">Put/Call Ratio</span>
          <p className="font-mono font-bold text-white text-sm mt-0.5">0.78</p>
          <span className="text-[10px] text-emerald-400 font-medium">Call Dominant</span>
        </div>
      </div>
    </div>
  );
};
