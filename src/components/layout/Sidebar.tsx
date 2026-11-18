import React from 'react';
import { useStock } from '../../context/StockContext';
import { ActiveTab } from '../../types';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Bookmark, 
  Briefcase, 
  Newspaper, 
  LogOut, 
  Sparkles,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, logout, watchlist, holdings, totalProfitLoss, isServerOnline, openProfileModal } = useStock();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }> = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      id: 'analysis', 
      label: 'AI Stock Analysis', 
      icon: BrainCircuit,
      badge: 'Gemini Pro',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    },
    { 
      id: 'watchlist', 
      label: 'Watchlist', 
      icon: Bookmark,
      badge: watchlist.length,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700'
    },
    { 
      id: 'portfolio', 
      label: 'Virtual Portfolio', 
      icon: Briefcase,
      badge: holdings.length > 0 ? `${totalProfitLoss >= 0 ? '+' : ''}$${totalProfitLoss.toFixed(0)}` : undefined,
      badgeColor: totalProfitLoss >= 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    { 
      id: 'news', 
      label: 'AI Market Sentiment', 
      icon: Newspaper,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d1424] border-r border-slate-800/80 flex flex-col z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-[#0B0F19]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-blue/30 text-white font-black">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">StockSense</span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded bg-brand-blue text-white shadow-sm shadow-blue-500/50">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Quantitative Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Workspaces
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-blue'}`} />
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Architecture & Stack
        </div>
        <div className="px-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            <span>Architecture</span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold">Client-Server</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isServerOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              Express Server
            </span>
            <span className="font-mono text-xs text-brand-blue font-semibold">Port 5000</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            <span>DB Ledger</span>
            <span className="font-mono text-[10px] text-indigo-400 font-semibold truncate max-w-[90px]">database.json</span>
          </div>
        </div>
      </nav>

      {/* User Mini Profile & Settings */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19]">
        <div className="p-2.5 rounded-xl bg-[#131B2E] border border-slate-800 space-y-2">
          <div 
            onClick={openProfileModal}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to Edit Profile & Settings"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-brand-blue/40 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name || 'User Profile'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user.email || 'Personal Account'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
            <button
              onClick={openProfileModal}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors text-center"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              title="Log Out & Switch User"
              className="py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-semibold transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
