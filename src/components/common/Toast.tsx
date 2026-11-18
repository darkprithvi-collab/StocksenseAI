import React from 'react';
import { useStock } from '../../context/StockContext';
import { CheckCircle2, AlertCircle, Info, TrendingUp, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useStock();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => {
        const isSuccess = notif.type === 'success';
        const isError = notif.type === 'error';
        const isTrade = notif.type === 'trade';

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-right-5 ${
              isTrade
                ? 'bg-[#10243E]/95 border-brand-blue/50 text-white'
                : isSuccess
                ? 'bg-[#0E2A1E]/95 border-emerald-500/50 text-white'
                : isError
                ? 'bg-[#2D1214]/95 border-rose-500/50 text-white'
                : 'bg-[#131B2E]/95 border-slate-700/60 text-slate-200'
            }`}
          >
            <div className="mt-0.5">
              {isTrade && <TrendingUp className="w-5 h-5 text-brand-blue" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isTrade && !isSuccess && !isError && <Info className="w-5 h-5 text-slate-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-wide">{notif.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">{notif.message}</p>
            </div>

            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
