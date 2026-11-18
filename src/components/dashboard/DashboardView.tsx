import React from 'react';
import { MarketOverview } from './MarketOverview';
import { InteractiveMainChart } from './InteractiveMainChart';
import { TopAIPicks } from './TopAIPicks';
import { MarketSentimentGauge } from './MarketSentimentGauge';
import { HotMovers } from './HotMovers';
import { useStock } from '../../context/StockContext';
import { Briefcase, ArrowUpRight, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, totalPortfolioValue, cash, totalProfitLoss, totalProfitLossPercent, setActiveTab, openTradeModal } = useStock();

  const isProfitable = totalProfitLoss >= 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Welcome & Viva Presentation Banner */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-[#111C33] via-[#10203D] to-[#121A2E] border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-blue/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Welcome back, {user.name.split(' ')[0]} 👋
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/30">
                PRO TERMINAL
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Algorithmic quantitative signals and multimodal sentiment analysis are synchronized. Live multi-asset feeds are streaming in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('portfolio')}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
              <span>Inspect Portfolio</span>
            </button>
            <button
              onClick={() => openTradeModal('NVDA', 'BUY')}
              className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-xs font-bold text-white shadow-lg shadow-brand-blue/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Trade</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Market Overview Indices */}
      <MarketOverview />

      {/* 2. Interactive Main Chart & Quick Portfolio Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <InteractiveMainChart />
        </div>

        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-fintech-card space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Virtual Account Summary
                  </h3>
                  <p className="text-[10px] text-slate-400">Real-time Paper Equity</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="text-slate-400 hover:text-white transition-colors"
                title="View Full Ledger"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Portfolio Net Worth</span>
                <p className="text-2xl font-black font-mono text-white mt-0.5">
                  ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Cash Balance</span>
                  <p className="text-sm font-mono font-bold text-white mt-0.5">
                    ${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total P&L</span>
                  <div className={`flex items-center gap-1 font-mono text-sm font-bold mt-0.5 ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span>{isProfitable ? '+' : ''}${totalProfitLoss.toFixed(2)}</span>
                    <span className="text-[10px]">({isProfitable ? '+' : ''}{totalProfitLossPercent.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Risk Guardrail:</strong> Maximum drawdown allocation is restricted to 15% per single equity ticker to preserve capital preservation metrics.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('portfolio')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors text-center"
          >
            Launch Full Trading Terminal
          </button>
        </div>
      </div>

      {/* 3. Top AI Picks */}
      <TopAIPicks />

      {/* 4. Market Sentiment Gauge + Hot Movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketSentimentGauge />
        <HotMovers />
      </div>
    </div>
  );
};
