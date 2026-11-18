import React from 'react';
import { useStock } from '../../context/StockContext';
import { 
  Briefcase, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Plus, 
  Minus, 
  History, 
  PieChart as PieIcon, 
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const PortfolioView: React.FC = () => {
  const { 
    cash, 
    holdings, 
    transactions, 
    totalPortfolioValue, 
    totalInvested, 
    totalProfitLoss, 
    totalProfitLossPercent, 
    resetPortfolio, 
    openTradeModal,
    setSelectedStockSymbol
  } = useStock();

  const isProfitable = totalProfitLoss >= 0;

  // Prepare allocation data for Pie Chart
  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'];
  const pieData = [
    { name: 'Cash (Liquid)', value: Number(cash.toFixed(2)), color: '#10b981' },
    ...holdings.map((h, i) => ({
      name: h.symbol,
      value: Number(h.totalValue.toFixed(2)),
      color: COLORS[i % COLORS.length]
    }))
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Portfolio Header & Metric Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-fintech-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Virtual Trading Portfolio
            </h1>
            <span className="text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active Simulator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated portfolio ledger with instant transaction execution, cash reconciliation, and live P&L tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetPortfolio}
            title="Reset capital to default $10,000 initial balance"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ($10k)</span>
          </button>

          <button
            onClick={() => openTradeModal('NVDA', 'BUY')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Execute Trade</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Portfolio Net Worth</span>
            <Wallet className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-black font-mono text-white mt-2">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Cash + Live Equity Holdings
          </p>
        </div>

        {/* Available Cash */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Available Cash</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-2">
            ${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Liquid Unallocated Balance
          </p>
        </div>

        {/* Invested Capital */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Invested Capital</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white mt-2">
            ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Cost Basis in Open Positions
          </p>
        </div>

        {/* Total Return / P&L */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Unrealized P&L</span>
            {isProfitable ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
          </div>
          <div className={`flex items-baseline gap-2 mt-2 font-mono ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className="text-2xl font-black">
              {isProfitable ? '+' : ''}${totalProfitLoss.toFixed(2)}
            </span>
            <span className="text-xs font-bold">
              ({isProfitable ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Relative to Cost Basis
          </p>
        </div>
      </div>

      {/* 2. Holdings Table & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-8 bg-[#111827] border border-slate-800/80 rounded-2xl shadow-fintech-card overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-slate-800 bg-[#0d1424] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-blue" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Active Equity Positions ({holdings.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Mark to Market (Live)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Shares</th>
                  <th className="py-3 px-4">Avg Cost</th>
                  <th className="py-3 px-4">Market Price</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">P&L ($/%)</th>
                  <th className="py-3 px-4 text-right">Quick Trade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {holdings.length > 0 ? (
                  holdings.map((h) => {
                    const isPos = h.totalReturn >= 0;
                    return (
                      <tr key={h.symbol} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setSelectedStockSymbol(h.symbol)}
                            className="text-left group"
                          >
                            <span className="font-mono font-bold text-white group-hover:text-brand-blue transition-colors">
                              {h.symbol}
                            </span>
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{h.name}</p>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {h.shares}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          ${h.avgBuyPrice.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-white">
                          ${h.currentPrice.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ${h.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className={`font-mono font-bold text-[11px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                            <span>{isPos ? '+' : ''}${h.totalReturn.toFixed(2)}</span>
                            <span className="text-[10px] block opacity-80">
                              ({isPos ? '+' : ''}{h.totalReturnPercent.toFixed(1)}%)
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openTradeModal(h.symbol, 'BUY')}
                              title="Buy More"
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]"
                            >
                              + Buy
                            </button>
                            <button
                              onClick={() => openTradeModal(h.symbol, 'SELL')}
                              title="Sell Shares"
                              className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-[10px]"
                            >
                              - Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      No open positions. Click &quot;Execute Trade&quot; to buy shares with your $10,000 buying power.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Allocation Donut Chart */}
        <div className="lg:col-span-4 bg-[#111827] border border-slate-800/80 rounded-2xl shadow-fintech-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-brand-blue" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Asset Weight Distribution
                </h3>
              </div>
            </div>

            <div className="h-52 w-full mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0];
                        const pct = ((Number(d.value) / totalPortfolioValue) * 100).toFixed(1);
                        return (
                          <div className="bg-[#131B2E] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs font-mono">
                            <span className="font-bold text-white">{d.name}</span>: ${Number(d.value).toLocaleString()} ({pct}%)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Holdings</span>
                <span className="text-sm font-black font-mono text-white">{holdings.length} Assets</span>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto">
              {pieData.map((item) => {
                const pct = ((item.value / totalPortfolioValue) * 100).toFixed(1);
                return (
                  <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-400">${item.value.toLocaleString()} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Trades execute instantly with automatic ledger reconciliation and zero slippage simulation.
          </div>
        </div>
      </div>

      {/* 3. Transaction Audit Trail */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl shadow-fintech-card overflow-hidden space-y-4">
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0d1424] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Transaction Order Audit Trail ({transactions.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Immutable server ledger order logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Order Action</th>
                <th className="py-3 px-4">Shares</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Total Consideration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {tx.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {tx.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {tx.symbol}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${
                          tx.type === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-white">
                      {tx.shares}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      ${tx.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 text-xs">
                    No transactions executed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
