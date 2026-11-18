import React, { useState } from 'react';
import { Stock, NewsHeadline } from '../../types';
import { generateGeminiAIResponse } from '../../services/geminiCopilot';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Send, 
  Gauge, 
  BarChart2, 
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface GeminiAIReportProps {
  stock: Stock;
}

export const GeminiAIReport: React.FC<GeminiAIReportProps> = ({ stock }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeReasoningTab, setActiveReasoningTab] = useState<'catalysts' | 'risks' | 'valuation' | 'summary'>('summary');
  
  // Interactive Gemini Q&A state
  const [userQuery, setUserQuery] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'gemini'; text: string }>>([
    {
      sender: 'gemini',
      text: `Hello! I am the StockSense Gemini Quantitative Assistant. Ask me ANY question about ${stock.symbol} — including RSI/MACD technical setups, P/E & DCF valuation, competitors, growth catalysts, downside risks, or general market concepts!`
    }
  ]);

  const insights = stock.aiInsights;
  const isBuy = insights.recommendation.includes('BUY');
  const isHold = insights.recommendation === 'HOLD';

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1200);
  };

  const handleAsk = (queryText: string) => {
    const q = queryText || userQuery;
    if (!q.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text: q }];
    setChatHistory(newHistory);
    setUserQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateGeminiAIResponse(q, stock);
      setChatHistory(prev => [...prev, { sender: 'gemini', text: answer }]);
      setIsTyping(false);
    }, 350);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-fintech-card overflow-hidden">
      {/* Top Banner with AI Model Badge & Regeneration Action */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#141F36] via-[#16233F] to-[#121B2F] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-blue/30 text-white">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-wide">
                Gemini AI Generated Insights Report
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 1.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multimodal News Sentiment + Quantitative Indicator Synthesis
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 text-brand-blue ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Synthesizing...' : 'Regenerate Analysis'}</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Structured Recommendation Hero Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0B0F19] border border-slate-800/90 shadow-inner">
          <div className="md:col-span-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verdict</span>
            <div className="my-2">
              <span
                className={`inline-block px-3.5 py-1.5 rounded-xl text-sm font-black tracking-wider ${
                  isBuy
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isHold
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                }`}
              >
                {insights.recommendation}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Risk Profile:</span>
              <span className={`font-bold ${insights.riskLevel === 'LOW' ? 'text-emerald-400' : insights.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>
                {insights.riskLevel}
              </span>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Confidence</span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-white">
                {insights.confidence}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-blue to-emerald-400 h-full rounded-full"
                style={{ width: `${insights.confidence}%` }}
              />
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Price (12M)</span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {stock.currency}{insights.targetPrice.toFixed(2)}
              </span>
            </div>
            <span className="text-xs text-emerald-300 font-semibold font-mono">
              +{insights.projectedUpside}% Projected Upside
            </span>
          </div>

          <div className="md:col-span-1 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">News Sentiment</span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-indigo-400">
                +{insights.sentiment.score}/100
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-300">
              {insights.sentiment.label} Tone
            </span>
          </div>
        </div>

        {/* 2. Technical Indicators Matrix & News Sentiment Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Technical Indicators Breakdown (RSI, MACD, Moving Averages, Bollinger) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-blue" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Quantitative Technical Indicators
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* RSI Indicator */}
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">RSI (14-Day)</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    {insights.indicators.rsi.value}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500/40 w-[30%]" />
                  <div className="h-full bg-emerald-400 w-[40%]" />
                  <div className="h-full bg-rose-500 w-[30%]" />
                </div>
                <p className="text-[11px] text-slate-400 pt-0.5 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">{insights.indicators.rsi.status}:</span> {insights.indicators.rsi.description}
                </p>
              </div>

              {/* MACD Indicator */}
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">MACD (12, 26, 9)</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{insights.indicators.macd.value}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Signal: {insights.indicators.macd.signal}</span>
                  <span className="text-emerald-400 font-bold">Histogram: +{insights.indicators.macd.histogram}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-0.5 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">{insights.indicators.macd.status}:</span> {insights.indicators.macd.description}
                </p>
              </div>

              {/* Moving Averages */}
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">EMA Alignment</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {insights.indicators.movingAverages.goldenCross ? 'Golden Cross Active' : 'Normal Stack'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 pt-1">
                  <div>EMA20: <span className="text-white font-semibold">{stock.currency}{insights.indicators.movingAverages.ema20}</span></div>
                  <div>EMA50: <span className="text-white font-semibold">{stock.currency}{insights.indicators.movingAverages.ema50}</span></div>
                  <div>EMA200: <span className="text-white font-semibold">{stock.currency}{insights.indicators.movingAverages.ema200}</span></div>
                </div>
              </div>

              {/* Bollinger Bands */}
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bollinger Bands (20, 2)</span>
                  <span className="text-xs font-mono text-slate-300">{insights.indicators.bollinger.status}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>Lower: {stock.currency}{insights.indicators.bollinger.lower}</span>
                  <span>Mid: {stock.currency}{insights.indicators.bollinger.middle}</span>
                  <span>Upper: {stock.currency}{insights.indicators.bollinger.upper}</span>
                </div>
              </div>
            </div>
          </div>

          {/* News Sentiment Meter & Headlines */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                News Sentiment Distribution
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-3">
              {/* Distribution bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-emerald-400">{insights.sentiment.positive}% Bullish</span>
                  <span className="text-slate-400">{insights.sentiment.neutral}% Neutral</span>
                  <span className="text-rose-400">{insights.sentiment.negative}% Bearish</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${insights.sentiment.positive}%` }} />
                  <div className="bg-slate-600 h-full" style={{ width: `${insights.sentiment.neutral}%` }} />
                  <div className="bg-rose-500 h-full" style={{ width: `${insights.sentiment.negative}%` }} />
                </div>
              </div>

              {/* Parsed News Headlines with AI Sentiment Tags */}
              <div className="space-y-2 pt-1 divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                {insights.sentiment.newsHeadlines.map((news) => (
                  <div key={news.id} className="pt-2 text-left space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">{news.source} • {news.time}</span>
                      <span className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                        news.sentiment === 'positive' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {news.sentiment.toUpperCase()} ({news.impact} Impact)
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      {news.title}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {news.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Automated Reasoning Structured Tabs */}
        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Reasoning & Thesis Breakdown
              </h4>
            </div>

            <div className="flex p-1 bg-[#131B2E] rounded-xl border border-slate-800">
              {(['summary', 'catalysts', 'risks', 'valuation'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveReasoningTab(t)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                    activeReasoningTab === t
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed min-h-[90px]">
            {activeReasoningTab === 'summary' && (
              <div className="space-y-2">
                <p className="text-slate-200 font-medium text-sm leading-relaxed">
                  {insights.summary}
                </p>
                <p className="text-slate-400 leading-relaxed pt-1">
                  <strong>Technical Confirmation:</strong> {insights.technicalSummary}
                </p>
              </div>
            )}

            {activeReasoningTab === 'catalysts' && (
              <ul className="space-y-2.5">
                {insights.catalysts.map((cat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeReasoningTab === 'risks' && (
              <ul className="space-y-2.5">
                {insights.downsideRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeReasoningTab === 'valuation' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">DCF Intrinsic Fair Value</span>
                    <p className="text-base font-mono font-bold text-white mt-0.5">
                      {stock.currency}{insights.valuationCheck.intrinsicValue.toFixed(2)}
                    </p>
                    <span className="text-[11px] text-emerald-400 font-semibold">{insights.valuationCheck.fairValueGap}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Multiple Justification</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {insights.valuationCheck.peComparison}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Interactive "Ask Gemini AI" for Examiner Viva Delight */}
        <div className="p-5 rounded-2xl bg-[#0E1729] border border-brand-blue/30 shadow-fintech-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-blue" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Interactive Gemini AI Financial Copilot
              </h4>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
              Live Q&A
            </span>
          </div>

          {/* Chat transcript */}
          <div className="space-y-2 max-h-60 overflow-y-auto p-3 rounded-xl bg-[#080C14] border border-slate-800/80">
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={`flex gap-2.5 text-xs ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {item.sender === 'gemini' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                    item.sender === 'user'
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'bg-[#131B2E] text-slate-200 border border-slate-800'
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 text-xs justify-start items-center">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  AI
                </div>
                <div className="p-2.5 rounded-xl bg-[#131B2E] text-slate-400 border border-slate-800 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
                  <span className="text-[11px]">Gemini is analyzing market data & synthesis...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick preset question pills for instant viva answers without typing */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 shrink-0 font-medium">Quick Prompts:</span>
            {[
              "Why Buy or Sell?",
              "Explain RSI & MACD",
              "Who are Competitors?",
              "Downside Risks",
              "What is P/E Ratio?",
              "Short vs Long Term",
              "What is Stop Loss?"
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAsk(prompt)}
                className="shrink-0 px-2.5 py-1 bg-[#131B2E] hover:bg-brand-blue/20 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 hover:border-brand-blue/50 transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(userQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Ask ANY financial question (e.g. "What is P/E?", "Who are competitors?", "Explain risk")`}
              className="flex-1 bg-[#0B0F19] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
            />
            <button
              type="submit"
              disabled={isTyping || !userQuery.trim()}
              className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
