import React from 'react';
import { StockProvider, useStock } from './context/StockContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MarketTicker } from './components/layout/MarketTicker';
import { DashboardView } from './components/dashboard/DashboardView';
import { StockAnalysisView } from './components/analysis/StockAnalysisView';
import { WatchlistView } from './components/watchlist/WatchlistView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { NewsSentimentView } from './components/news/NewsSentimentView';
import { TradeModal } from './components/common/TradeModal';
import { ProfileModal } from './components/common/ProfileModal';
import { ToastContainer } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const { user, activeTab, isProfileModalOpen, closeProfileModal } = useStock();

  // If user is logged out, show the auth screen
  if (!user.isLoggedIn) {
    return (
      <>
        <AuthScreen />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      {/* 1. Fixed Professional Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main Terminal Content Area (Offset by sidebar width 64 = 16rem) */}
      <div className="flex-1 ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Top Header */}
        <Header />

        {/* Live Market Marquee Ticker */}
        <MarketTicker />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'analysis' && <StockAnalysisView />}
          {activeTab === 'watchlist' && <WatchlistView />}
          {activeTab === 'portfolio' && <PortfolioView />}
          {activeTab === 'news' && <NewsSentimentView />}
        </main>
      </div>

      {/* Global Interactive Modals & Toast Alerts */}
      <TradeModal />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StockProvider>
      <MainLayout />
    </StockProvider>
  );
};

export default App;
