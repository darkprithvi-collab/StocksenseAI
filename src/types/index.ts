export type AIRating = 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type TimeFrame = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export interface ChartDataPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  rsi?: number;
  ema20?: number;
  ema50?: number;
}

export interface NewsHeadline {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'High' | 'Medium' | 'Low';
  snippet: string;
}

export interface IndicatorDetails {
  value: number;
  status: string;
  description: string;
}

export interface AIInsights {
  recommendation: AIRating;
  confidence: number;
  targetPrice: number;
  projectedUpside: number;
  riskLevel: RiskLevel;
  summary: string;
  catalysts: string[];
  downsideRisks: string[];
  technicalSummary: string;
  sentiment: {
    score: number; // e.g. +78
    positive: number; // %
    neutral: number; // %
    negative: number; // %
    label: 'Extremely Bullish' | 'Bullish' | 'Neutral' | 'Bearish';
    newsHeadlines: NewsHeadline[];
  };
  indicators: {
    rsi: IndicatorDetails;
    macd: {
      value: number;
      signal: number;
      histogram: number;
      status: string;
      description: string;
    };
    movingAverages: {
      ema20: number;
      ema50: number;
      ema200: number;
      status: string;
      goldenCross: boolean;
    };
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
      status: string;
    };
  };
  valuationCheck: {
    peComparison: string;
    intrinsicValue: number;
    fairValueGap: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  avgVolume: string;
  marketCap: string;
  peRatio: number;
  week52High: number;
  week52Low: number;
  beta: number;
  sector: string;
  aiRating: AIRating;
  aiConfidence: number;
  targetPrice: number;
  sparkline: number[];
  chartData: Record<TimeFrame, ChartDataPoint[]>;
  aiInsights: AIInsights;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: string;
  numericPrice: number;
  change: string;
  changePercent: number;
  sparkline: number[];
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  sector: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'trade';
  timestamp: Date;
}

export type ActiveTab = 'dashboard' | 'analysis' | 'watchlist' | 'portfolio' | 'news';
