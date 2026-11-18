# StockSense AI — Institutional Quantitative Intelligence & Trading Terminal

[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TypeScript-blue.svg)](https://reactjs.org/)
[![Node Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20REST-green.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v3-06B6D4.svg)](https://tailwindcss.com/)
[![AI Engine](https://img.shields.io/badge/Intelligence-Gemini%201.5%20Pro%20Copilot-8B5CF6.svg)](https://deepmind.google/technologies/gemini/)
[![Storage](https://img.shields.io/badge/Storage-Persistent%20JSON%20Ledger-amber.svg)](./server/database.json)

StockSense AI is an institutional-grade quantitative stock analysis and virtual paper-trading platform designed for financial analysts, active traders, and academic presentations. It integrates multi-timeframe technical indicator calculations (RSI, MACD, Moving Averages), discounted cash flow (DCF) intrinsic valuation, and conversational quantitative analysis powered by Google DeepMind Gemini models.

---

## 🚀 Key Highlights & Architectural Features

1. **Decoupled Client-Server Architecture**:
   - **Frontend**: High-speed Single Page Application powered by React 18, Vite, TypeScript, Lucide Icons, and Tailwind CSS running on `http://localhost:5173`.
   - **Backend**: Express REST API running on `http://localhost:5000` with dual IPv4 (`127.0.0.1`) and IPv6 (`::1`) socket binding.
   - **Persistence**: Server ledger (`server/database.json`) for user authentication, live transactions, holdings, and watchlists.

2. **Real-Time Technical & Quantitative Analysis**:
   - Dynamic RSI, MACD divergence detection, 50-day / 200-day Golden / Death Cross monitors.
   - Institutional Valuation models (DCF fair value calculation, margin of safety, Beta, P/E ratio, PEG).
   - Multi-asset coverage spanning US Equities (NVDA, AAPL, MSFT, GOOGL, TSLA, AMZN) and Indian Bluechips (NSE RELIANCE, TATAMOTORS).

3. **Gemini 1.5 Conversational Copilot**:
   - Multi-topic conversational engine capable of answering technical questions (RSI vs MACD, Stop-Loss rules, Intrinsic Value calculations, macro interest rates, long-term vs swing strategies).
   - Real-time thinking animation, structured Buy/Hold/Sell breakdowns, and customized analyst prompts.

4. **$10,000 Virtual Trading Simulator**:
   - Zero-risk paper trading environment with instant order execution.
   - Live P&L calculations, average buy price recalculation, and persistent transaction audit logs saved to the server.

5. **Client-Server Authentication**:
   - Strict password verification (401 Unauthorized for incorrect passwords, 404 for unregistered emails, 409 for duplicate registration).
   - Editable user profiles (Name, Role, Avatar) synchronized directly into `server/database.json`.

---

## 🛠️ Tech Stack

- **Client**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Lucide React, Canvas Confetti
- **Server**: Node.js, Express 4, CORS
- **Database**: Persistent JSON File Ledger (`server/database.json`)
- **APIs**: RESTful JSON API (`/api/auth`, `/api/portfolio`, `/api/users`, `/api/health`)

---

## 📦 Project Structure

```bash
StocksenseAI/
├── public/                # Static public assets
├── src/
│   ├── components/
│   │   ├── analysis/      # Quantitative chart, technical breakdown, Gemini copilot
│   │   ├── auth/          # Authentication screen with password validation & quick demo
│   │   ├── common/        # Trade modal, profile modal, toast notifications
│   │   ├── dashboard/     # Market overview, top gainers, quick stats
│   │   ├── layout/        # Sidebar navigation, top header, market ticker marquee
│   │   ├── news/          # Financial news sentiment analyzer
│   │   ├── portfolio/     # Virtual paper trading balance, holdings & order history
│   │   └── watchlist/     # Real-time stock watchlist
│   ├── context/           # StockContext state management
│   ├── services/          # HTTP API client and Gemini Copilot knowledge engine
│   ├── types/             # TypeScript data contracts
│   ├── App.tsx            # Root application layout
│   └── main.tsx           # Entrypoint
├── server/
│   ├── database.json      # Persistent disk database ledger
│   ├── db.js              # Database CRUD operations and ledger mutations
│   ├── package.json       # Express server dependencies
│   └── server.js          # REST API endpoints & IPv4/IPv6 listener
├── .gitignore
├── package.json           # Frontend dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/StocksenseAI.git
cd StocksenseAI
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 3. Start Backend Server (Port 5000)
```bash
node server/server.js
# Output: [StockSense Server] REST API active on http://127.0.0.1:5000 and [::1]:5000
```

### 4. Start Frontend Terminal (Port 5173)
```bash
npm run dev
# Terminal ready at http://localhost:5173/
```

---

## 🔑 Default Credentials & Test Accounts

You can log in using either the pre-seeded accounts or create your own personal account:

| Account Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Lead Analyst (Default)** | `alex.vance@stocksense.ai` | `password123` | Lead Quantitative Researcher |
| **Personal Account** | `darkprithvi@gmail.com` | `password123` | Quantitative Analyst & Portfolio Manager |

> **Note**: You can also click the **"Quick Launch"** or **"Fill Demo Credentials"** button on the Sign-In screen for instant one-click access.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check and server status |
| `/api/users` | `GET` | Retrieve list of registered users |
| `/api/auth/login` | `POST` | Authenticate user with email and password |
| `/api/auth/signup` | `POST` | Register a new user into `database.json` |
| `/api/auth/profile` | `PUT` | Update user name, role, and avatar |
| `/api/portfolio/holdings` | `GET` | Get cash balance, holdings, and transactions |
| `/api/portfolio/buy` | `POST` | Execute virtual market buy order |
| `/api/portfolio/sell` | `POST` | Execute virtual market sell order |
| `/api/portfolio/reset` | `POST` | Reset paper trading account to $10,000 cash |

---

## 📄 License
MIT License. Built for academic, demonstration, and quantitative research purposes.
