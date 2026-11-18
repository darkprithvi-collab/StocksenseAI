import React, { useState, useEffect } from 'react';
import { useStock } from '../../context/StockContext';
import { X, TrendingUp, TrendingDown, DollarSign, AlertCircle, ShieldCheck } from 'lucide-react';

export const TradeModal: React.FC = () => {
  const { 
    tradeModal, 
    closeTradeModal, 
    stocks, 
    cash, 
    holdings, 
    buyStock, 
    sellStock 
  } = useStock();

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [shares, setShares] = useState<number>(1);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (tradeModal.isOpen) {
      setSelectedSymbol(tradeModal.symbol || 'NVDA');
      setOrderType(tradeModal.defaultType || 'BUY');
      setShares(1);
      setError('');
    }
  }, [tradeModal]);

  if (!tradeModal.isOpen) return null;

  const currentStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];
  const currentHolding = holdings.find(h => h.symbol === selectedSymbol);
  const ownedShares = currentHolding?.shares || 0;

  const totalCost = Number((currentStock.price * shares).toFixed(2));
  const maxBuyShares = Math.floor(cash / currentStock.price);

  const handleSharesChange = (val: number) => {
    setError('');
    setShares(Math.max(1, Math.floor(val)));
  };

  const handleQuickShares = (num: number) => {
    setError('');
    if (orderType === 'BUY') {
      if (num === -1) {
        setShares(Math.max(1, maxBuyShares));
      } else {
        setShares(num);
      }
    } else {
      if (num === -1) {
        setShares(Math.max(1, ownedShares));
      } else {
        setShares(Math.min(num, ownedShares));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (orderType === 'BUY') {
      if (totalCost > cash) {
        setError(`Insufficient funds. You need $${totalCost.toLocaleString()} but only have $${cash.toLocaleString()} available.`);
        return;
      }
      const res = buyStock(selectedSymbol, shares);
      if (res.success) {
        closeTradeModal();
      } else {
        setError(res.message);
      }
    } else {
      if (shares > ownedShares) {
        setError(`You only own ${ownedShares} shares of ${selectedSymbol}. Cannot sell ${shares}.`);
        return;
      }
      const res = sellStock(selectedSymbol, shares);
      if (res.success) {
        closeTradeModal();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131B2E]">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${orderType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {orderType === 'BUY' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Virtual Order Execution
              </h3>
              <p className="text-xs text-slate-400">Paper Trading Simulator (Instant Fill)</p>
            </div>
          </div>
          <button
            onClick={closeTradeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: BUY / SELL */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B0F19] rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setOrderType('BUY'); setError(''); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                orderType === 'BUY'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              BUY (Long)
            </button>
            <button
              type="button"
              onClick={() => { setOrderType('SELL'); setError(''); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                orderType === 'SELL'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              SELL (Exit)
            </button>
          </div>

          {/* Stock selector & quote info */}
          <div className="bg-[#131B2E] p-4 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset</label>
              <span className="text-xs text-slate-400">
                {orderType === 'BUY' ? `Available Cash: $${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `You Own: ${ownedShares} Shares`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-[#0B0F19] text-white font-mono font-bold text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-blue flex-1"
              >
                {stocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.name} ({s.currency}{s.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-xs text-slate-400">Market Price:</span>
              <span className="text-sm font-mono font-bold text-white">
                {currentStock.currency}{currentStock.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Share Quantity Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Quantity (Shares)</label>
              <span className="text-xs font-mono text-slate-400">
                Order Value: <span className="text-white font-semibold">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={shares || ''}
                onChange={(e) => handleSharesChange(Number(e.target.value))}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                placeholder="1"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                SHARES
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 5, 10, 25].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickShares(preset)}
                  className="flex-1 py-1 text-xs font-mono font-semibold bg-[#1a233a] hover:bg-[#223052] text-slate-300 rounded-lg border border-slate-700/50 transition-colors"
                >
                  +{preset}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickShares(-1)}
                className="flex-1 py-1 text-xs font-semibold bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border border-brand-blue/30 rounded-lg transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Error notice if any */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Summary Box */}
          <div className="p-3.5 bg-[#0B0F19]/80 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Execution Type</span>
              <span className="text-white font-medium">Market Order (Instant)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Commission & Exchange Fees</span>
              <span className="text-emerald-400 font-medium">$0.00 (Zero Fee Paper Trading)</span>
            </div>
            <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-slate-800">
              <span>{orderType === 'BUY' ? 'Total Cash Required' : 'Estimated Net Proceeds'}</span>
              <span className="text-white font-mono text-sm">
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                orderType === 'BUY'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              CONFIRM {orderType} ORDER ({shares} {selectedSymbol})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
