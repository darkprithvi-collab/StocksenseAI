# StockSense AI — Institutional Quantitative Intelligence & Trading Terminal

[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TypeScript-blue.svg)](https://reactjs.org/)
[![Node Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20REST-green.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v3-06B6D4.svg)](https://tailwindcss.com/)
[![AI Engine](https://img.shields.io/badge/Intelligence-Gemini%201.5%20Pro%20Copilot-8B5CF6.svg)](https://deepmind.google/technologies/gemini/)
[![Storage](https://img.shields.io/badge/Storage-Persistent%20JSON%20Ledger-amber.svg)](./server/database.json)

An institutional-grade quantitative stock analysis and virtual paper-trading platform featuring real-time technical indicators (RSI, MACD, Bollinger Bands), DCF intrinsic valuation, AI-powered sentiment analysis, and a Gemini conversational copilot.

---

## 📂 Complete Project Structure — Organized by Layer

```
StocksenseAI/
│
├─── 🎨 FRONTEND (React + TypeScript + Vite)
│    │
│    ├── src/
│    │   │
│    │   ├── main.tsx                          # ⚡ App entry point — mounts React root
│    │   ├── App.tsx                           # 🏗️  Root layout — routes tabs to views
│    │   ├── index.css                         # 🎨 Global styles + Tailwind directives
│    │   ├── vite-env.d.ts                     # 📝 Vite environment type declarations
│    │   │
│    │   ├── types/
│    │   │   └── index.ts                      # 📋 All TypeScript interfaces & types
│    │   │                                     #    (Stock, User, AIInsights, ActiveTab,
│    │   │                                     #     Portfolio, Transaction, etc.)
│    │   │
│    │   ├── data/
│    │   │   └── mockStocks.ts                 # 📊 Stock universe data (17 stocks)
│    │   │                                     #    US: NVDA, AAPL, TSLA, MSFT, GOOGL
│    │   │                                     #    India: RELIANCE, TATAMOTORS
│    │   │                                     #    + Market indices (S&P, NIFTY, BTC)
│    │   │                                     #    + generateChartData() helper
│    │   │
│    │   ├── context/
│    │   │   └── StockContext.tsx               # 🧠 Central state management
│    │   │                                     #    - Auth (login/signup/forgot password)
│    │   │                                     #    - Live price tick simulation
│    │   │                                     #    - Watchlist & portfolio state
│    │   │                                     #    - Trade execution logic
│    │   │                                     #    - Notification system
│    │   │
│    │   ├── services/
│    │   │   ├── api.ts                        # 🌐 HTTP API client layer
│    │   │   │                                 #    apiLogin, apiSignup, apiForgotPassword,
│    │   │   │                                 #    apiResetPassword, apiBuyStock, apiSellStock
│    │   │   │                                 #    + safeFetchJson error handler
│    │   │   │
│    │   │   └── geminiCopilot.ts              # 🤖 Gemini AI knowledge engine
│    │   │                                     #    Multi-topic financial Q&A
│    │   │
│    │   └── components/
│    │       │
│    │       ├── auth/
│    │       │   └── AuthScreen.tsx             # 🔐 Login / Sign Up / Forgot Password
│    │       │                                 #    - Email + password login
│    │       │                                 #    - OTP via email for password reset
│    │       │                                 #    - Quick Launch demo access
│    │       │
│    │       ├── layout/
│    │       │   ├── Sidebar.tsx                # 📌 Fixed left navigation sidebar
│    │       │   ├── Header.tsx                 # 🔍 Top bar with search & user info
│    │       │   └── MarketTicker.tsx           # 📈 Live scrolling market indices ticker
│    │       │
│    │       ├── dashboard/
│    │       │   ├── DashboardView.tsx          # 🏠 Main dashboard — overview of all data
│    │       │   ├── MarketOverview.tsx         # 📊 Market indices cards
│    │       │   ├── InteractiveMainChart.tsx   # 📉 Large interactive stock chart
│    │       │   ├── TopAIPicks.tsx             # 🏆 AI-recommended top stock picks
│    │       │   ├── HotMovers.tsx             # 🔥 Biggest gainers & losers
│    │       │   └── MarketSentimentGauge.tsx   # 🎯 Overall market mood indicator
│    │       │
│    │       ├── analysis/
│    │       │   ├── StockAnalysisView.tsx      # 🔬 Deep stock analysis page
│    │       │   │                             #    RSI, MACD, Bollinger, EMA charts
│    │       │   │                             #    AI insights, catalysts, risks
│    │       │   └── GeminiAIReport.tsx         # 💬 Interactive AI copilot chat
│    │       │                                 #    Ask anything about stocks
│    │       │
│    │       ├── watchlist/
│    │       │   └── WatchlistView.tsx          # ⭐ Tracked stocks with live prices
│    │       │
│    │       ├── portfolio/
│    │       │   └── PortfolioView.tsx          # 💼 Virtual portfolio & trade history
│    │       │                                 #    $10,000 paper trading simulator
│    │       │
│    │       ├── news/
│    │       │   └── NewsSentimentView.tsx      # 📰 AI-scored news sentiment feed
│    │       │
│    │       └── common/
│    │           ├── TradeModal.tsx             # 💱 Buy/Sell order execution modal
│    │           ├── ProfileModal.tsx           # 👤 Edit profile (name, role, avatar)
│    │           └── Toast.tsx                  # 🔔 Toast notification system
│    │
│    └── index.html                            # 📄 HTML shell for Vite SPA
│
│
├─── ⚙️ BACKEND (Node.js + Express REST API)
│    │
│    ├── server/
│    │   ├── server.js                         # 🚀 Express server — Port 5000
│    │   │                                     #    All REST API route handlers
│    │   │                                     #    Dual IPv4/IPv6 binding
│    │   │                                     #    Serves static dist/ in production
│    │   │
│    │   ├── db.js                             # 🗄️  Database CRUD operations
│    │   │                                     #    verifyUserLogin, registerUser,
│    │   │                                     #    updateUserPassword, getPortfolioData,
│    │   │                                     #    executeStockBuy, executeStockSell
│    │   │
│    │   ├── mailer.js                         # 📧 Email service (Resend API)
│    │   │                                     #    Password reset OTP delivery
│    │   │                                     #    Beautiful dark-theme HTML emails
│    │   │
│    │   ├── .env                              # 🔑 Environment secrets (NOT in git)
│    │   │                                     #    RESEND_API_KEY=re_xxxxx
│    │   │
│    │   └── package.json                      # 📦 Server dependencies
│    │
│    └── 🗃️ DATABASE
│        └── server/database.json              # 💾 Persistent JSON file database
│                                              #    Users, portfolios, transactions,
│                                              #    watchlists — all persisted to disk
│
│
├─── 📡 REST API ENDPOINTS
│    │
│    │  AUTHENTICATION
│    │  ├── POST /api/auth/login               # Sign in with email + password
│    │  ├── POST /api/auth/signup              # Register new account
│    │  ├── POST /api/auth/forgot-password     # Send OTP to email
│    │  └── POST /api/auth/reset-password      # Verify OTP & set new password
│    │
│    │  PORTFOLIO & TRADING
│    │  ├── GET  /api/portfolio/holdings        # Get cash, holdings, transactions
│    │  ├── POST /api/portfolio/buy             # Execute virtual buy order
│    │  ├── POST /api/portfolio/sell            # Execute virtual sell order
│    │  └── POST /api/portfolio/reset           # Reset to $10,000 starting cash
│    │
│    │  USER MANAGEMENT
│    │  ├── GET  /api/users                     # List all registered users
│    │  └── PUT  /api/auth/profile              # Update name, role, avatar
│    │
│    │  SYSTEM
│    │  └── GET  /api/health                    # Server health check
│    │
│
├─── 🛠️ BUILD & CONFIG
│    ├── package.json                          # Frontend + shared dependencies
│    ├── package-lock.json                     # Dependency lock file
│    ├── tsconfig.json                         # TypeScript compiler config
│    ├── tsconfig.node.json                    # TypeScript config for Node
│    ├── vite.config.ts                        # Vite build configuration
│    ├── tailwind.config.js                    # Tailwind CSS theme & colors
│    ├── postcss.config.js                     # PostCSS plugin config
│    └── .gitignore                            # Git ignore rules
│
│
└─── 🚀 DEPLOYMENT
     ├── vercel.json                           # Vercel SPA deployment config
     └── railway.json                          # Railway backend deployment config
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Recharts, Lucide React |
| **Backend** | Node.js, Express 4, CORS, Resend API, Nodemailer |
| **Database** | Persistent JSON File Ledger (`server/database.json`) |
| **AI Engine** | Google Gemini 1.5 Pro — conversational copilot & analysis |
| **Deployment** | Vercel (frontend), Railway (backend), GitHub (source control) |

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/darkprithvi-collab/StocksenseAI.git
cd StocksenseAI
npm install
cd server && npm install && cd ..
```

### 2. Start Backend (Port 5000)
```bash
node server/server.js
```

### 3. Start Frontend (Port 5173)
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173/
```

---

## 🔑 Test Accounts

| Email | Password | Role |
|:---|:---|:---|
| `alex.vance@stocksense.ai` | `password123` | Lead Quantitative Researcher |
| `darkprithvi@gmail.com` | `password123` | Quantitative Analyst |

> Click **"Quick Launch"** on the login screen for instant demo access.

---

## 🎨 Design Theme

- **Background**: `#0B0F19` (deep dark)
- **Positive/Green**: `#10b981` (emerald)
- **Negative/Red**: `#ef4444` (crimson)
- **Accent/Blue**: `#3b82f6` (brand blue)

---

## 📄 License

MIT License. Built for academic demonstration and quantitative research purposes.

**Team**: Prithviraj (Full-Stack Lead) | Field Project 2026
