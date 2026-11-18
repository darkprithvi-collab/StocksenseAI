import { Stock, MarketIndex, TimeFrame, ChartDataPoint } from '../types';

// Helper to generate realistic chart points
function generateChartData(basePrice: number, volatility: number): Record<TimeFrame, ChartDataPoint[]> {
  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '1Y', 'ALL'];
  const result: Partial<Record<TimeFrame, ChartDataPoint[]>> = {};

  // 1D: 24 points (every 15-30 min)
  const d1: ChartDataPoint[] = [];
  let curr = basePrice * 0.985;
  const hours = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  for (let i = 0; i < hours.length; i++) {
    const change = (Math.random() - 0.46) * volatility * basePrice * 0.015;
    curr = Math.max(curr + change, basePrice * 0.7);
    d1.push({
      time: hours[i],
      price: Number(curr.toFixed(2)),
      volume: Math.floor(Math.random() * 800000 + 200000),
      rsi: Math.floor(45 + Math.random() * 25),
      ema20: Number((curr * 0.995).toFixed(2)),
      ema50: Number((curr * 0.988).toFixed(2))
    });
  }
  // ensure last point hits basePrice
  d1[d1.length - 1].price = basePrice;
  result['1D'] = d1;

  // 1W: 7 days
  const w1: ChartDataPoint[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Prev Mon', 'Today'];
  curr = basePrice * 0.95;
  for (let i = 0; i < days.length; i++) {
    const change = (Math.random() - 0.42) * volatility * basePrice * 0.03;
    curr += change;
    w1.push({
      time: days[i],
      price: Number(curr.toFixed(2)),
      volume: Math.floor(Math.random() * 15000000 + 5000000),
      rsi: Math.floor(40 + Math.random() * 30),
      ema20: Number((curr * 0.99).toFixed(2)),
      ema50: Number((curr * 0.97).toFixed(2))
    });
  }
  w1[w1.length - 1].price = basePrice;
  result['1W'] = w1;

  // 1M: 30 days sampled into 10 points
  const m1: ChartDataPoint[] = [];
  curr = basePrice * 0.92;
  const mLabels = ['Week 1', 'Week 1.5', 'Week 2', 'Week 2.5', 'Week 3', 'Week 3.5', 'Week 4', 'Now'];
  for (let i = 0; i < mLabels.length; i++) {
    const change = (Math.random() - 0.4) * volatility * basePrice * 0.04;
    curr += change;
    m1.push({
      time: mLabels[i],
      price: Number(curr.toFixed(2)),
      volume: Math.floor(Math.random() * 20000000 + 8000000),
      rsi: Math.floor(48 + Math.random() * 22),
      ema20: Number((curr * 0.98).toFixed(2)),
      ema50: Number((curr * 0.96).toFixed(2))
    });
  }
  m1[m1.length - 1].price = basePrice;
  result['1M'] = m1;

  // 1Y: 12 months
  const y1: ChartDataPoint[] = [];
  curr = basePrice * 0.72;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < months.length; i++) {
    const change = (Math.random() - 0.35) * volatility * basePrice * 0.07;
    curr += change;
    y1.push({
      time: months[i],
      price: Number(curr.toFixed(2)),
      volume: Math.floor(Math.random() * 40000000 + 15000000),
      rsi: Math.floor(52 + Math.random() * 20),
      ema20: Number((curr * 0.96).toFixed(2)),
      ema50: Number((curr * 0.92).toFixed(2))
    });
  }
  y1[y1.length - 1].price = basePrice;
  result['1Y'] = y1;

  // ALL: 5 years
  const all: ChartDataPoint[] = [];
  curr = basePrice * 0.35;
  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  for (let i = 0; i < years.length; i++) {
    const change = (Math.random() - 0.28) * volatility * basePrice * 0.15;
    curr += change;
    all.push({
      time: years[i],
      price: Number(curr.toFixed(2)),
      volume: Math.floor(Math.random() * 60000000 + 25000000),
      rsi: Math.floor(55 + Math.random() * 15),
      ema20: Number((curr * 0.94).toFixed(2)),
      ema50: Number((curr * 0.88).toFixed(2))
    });
  }
  all[all.length - 1].price = basePrice;
  result['ALL'] = all;

  return result as Record<TimeFrame, ChartDataPoint[]>;
}

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    currency: '$',
    price: 138.25,
    change: 4.82,
    changePercent: 3.61,
    open: 134.10,
    high: 139.40,
    low: 133.80,
    volume: '68.4M',
    avgVolume: '54.2M',
    marketCap: '$3.38T',
    peRatio: 52.4,
    week52High: 140.76,
    week52Low: 45.60,
    beta: 1.68,
    sector: 'Semiconductors & AI',
    aiRating: 'STRONG BUY',
    aiConfidence: 94,
    targetPrice: 165.00,
    sparkline: [126, 128, 127, 131, 133, 132, 135, 138.25],
    chartData: generateChartData(138.25, 1.2),
    aiInsights: {
      recommendation: 'STRONG BUY',
      confidence: 94,
      targetPrice: 165.00,
      projectedUpside: 19.35,
      riskLevel: 'MODERATE',
      summary: 'Dominant market share (>85%) in enterprise AI accelerators, sustained Blackwell architecture order pipeline, and expanding sovereign AI compute investments make NVIDIA the premier quantitative compounder.',
      catalysts: [
        'Blackwell B200 ultra-high demand with enterprise allocations booked through Q3 next year.',
        'Hyperscaler CapEx guidance from Microsoft, Meta, and Alphabet increased by an aggregate 28% for AI infrastructure.',
        'Sovereign AI initiatives in Japan, UAE, and Europe securing multi-billion-dollar direct cluster deployments.'
      ],
      downsideRisks: [
        'Export restriction tightening by US Department of Commerce on modified semiconductor shipments.',
        'Potential supply chain bottleneck at TSMC 3nm CoWoS advanced packaging capacity.'
      ],
      technicalSummary: 'Bullish continuation pattern confirmed above the 50-day EMA ($124.80). RSI at 66 indicates strong positive momentum without reaching extreme overbought territory. MACD line recently executed a bullish crossover above signal line.',
      sentiment: {
        score: 84,
        positive: 78,
        neutral: 16,
        negative: 6,
        label: 'Extremely Bullish',
        newsHeadlines: [
          {
            id: 'n1',
            title: 'Blackwell GPU Demand Outstrips Supply As AI Infrastructure Spends Reach All-Time Peak',
            source: 'Bloomberg Markets',
            time: '18m ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Cloud titans reaffirm relentless hardware scaling, positioning NVDA for another consensus-beating quarterly revenue cycle.'
          },
          {
            id: 'n2',
            title: 'Major Wall Street Prime Brokerage Raises NVDA Price Target to $170 on Software Revenue Growth',
            source: 'Morgan Stanley Research',
            time: '2h ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'NVIDIA AI Enterprise platform ARR doubled year-over-year, illustrating robust high-margin software monetization.'
          },
          {
            id: 'n3',
            title: 'Semiconductor Index Pulls Broader Markets Higher as Tech Sector Leads Volume',
            source: 'Reuters Financial',
            time: '4h ago',
            sentiment: 'positive',
            impact: 'Medium',
            snippet: 'Institutional cash flows rotated back into semiconductor equities following dovish macroeconomic sentiment.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 66.2,
          status: 'Bullish Momentum',
          description: 'Strong upward buying pressure; healthy clearance before 70 overbought threshold.'
        },
        macd: {
          value: 2.45,
          signal: 1.82,
          histogram: 0.63,
          status: 'Bullish Crossover',
          description: 'Fast line is accelerating above the 9-day signal line with expanding green histogram bars.'
        },
        movingAverages: {
          ema20: 132.40,
          ema50: 124.80,
          ema200: 98.15,
          status: 'Golden Alignment',
          goldenCross: true
        },
        bollinger: {
          upper: 142.10,
          middle: 133.50,
          lower: 124.90,
          status: 'Testing Upper Band'
        }
      },
      valuationCheck: {
        peComparison: 'Forward P/E of 36.2x is justifiable against 55% projected EPS CAGR through 2026.',
        intrinsicValue: 168.50,
        fairValueGap: '+21.8% undervaluation based on discounted cash flow (DCF) model.'
      },
      faq: [
        {
          question: 'Why does Gemini AI rate NVDA as a Strong Buy despite high valuation?',
          answer: 'StockSense AI calculates that NVIDIA PEG ratio (Price/Earnings-to-Growth) remains under 1.1x due to triple-digit net income expansion, significantly more attractive than peer semiconductor multiples.'
        },
        {
          question: 'What is the immediate stop-loss recommendation?',
          answer: 'We recommend trailing stop loss at $128.50 (just under the 20-day EMA support cluster) to protect capital while letting gains run.'
        }
      ]
    }
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: '$',
    price: 228.40,
    change: 1.95,
    changePercent: 0.86,
    open: 226.90,
    high: 229.80,
    low: 226.20,
    volume: '44.2M',
    avgVolume: '48.1M',
    marketCap: '$3.47T',
    peRatio: 33.8,
    week52High: 237.23,
    week52Low: 164.08,
    beta: 1.05,
    sector: 'Consumer Electronics & Services',
    aiRating: 'BUY',
    aiConfidence: 87,
    targetPrice: 255.00,
    sparkline: [221, 223, 222, 225, 226, 227, 226, 228.40],
    chartData: generateChartData(228.40, 0.8),
    aiInsights: {
      recommendation: 'BUY',
      confidence: 87,
      targetPrice: 255.00,
      projectedUpside: 11.64,
      riskLevel: 'LOW',
      summary: 'Apple Intelligence deployment across 1.4B active iOS units initiates a massive multi-year hardware supercycle. High-margin Services segment continues recurring margin expansion.',
      catalysts: [
        'Rollout of next-gen Siri with personalized on-device LLMs driving upgrade intent.',
        'Services revenue (iCloud, App Store, Apple Pay) surpassing $25B per quarter at 74% gross margins.',
        'Aggressive capital return program with $110B authorized share repurchases.'
      ],
      downsideRisks: [
        'EU Digital Markets Act regulatory scrutiny impacting third-party app commission structures.',
        'Competitive smartphone pricing in Greater China.'
      ],
      technicalSummary: 'Constructive consolidation above 20-day EMA ($224.15). Healthy volume shelf support at $222. RSI neutral-bullish at 58.4.',
      sentiment: {
        score: 68,
        positive: 65,
        neutral: 25,
        negative: 10,
        label: 'Bullish',
        newsHeadlines: [
          {
            id: 'a1',
            title: 'Apple Expands On-Device AI Models with Optimized Memory Architecture',
            source: 'TechCrunch',
            time: '1h ago',
            sentiment: 'positive',
            impact: 'Medium',
            snippet: 'New silicon updates enable faster generative reasoning while preserving battery longevity.'
          },
          {
            id: 'a2',
            title: 'Services Segment Growth Hits Record High in Q4 Projections',
            source: 'Wall Street Journal',
            time: '5h ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Subscription base reaches 1 billion paid subscriptions globally.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 58.4,
          status: 'Neutral Bullish',
          description: 'Steady accumulation without any sign of retail exhaustion.'
        },
        macd: {
          value: 1.15,
          signal: 0.95,
          histogram: 0.20,
          status: 'Positive Drift',
          description: 'Slight positive histogram slope confirming underlying upward drift.'
        },
        movingAverages: {
          ema20: 224.15,
          ema50: 218.60,
          ema200: 195.40,
          status: 'Strong Trend Alignment',
          goldenCross: true
        },
        bollinger: {
          upper: 232.40,
          middle: 225.20,
          lower: 218.00,
          status: 'Upper Half Consolidation'
        }
      },
      valuationCheck: {
        peComparison: 'P/E of 33.8x trades at a slight premium to historical 5Y average (29x) warranted by Services expansion.',
        intrinsicValue: 248.00,
        fairValueGap: '+8.6% fair value premium.'
      },
      faq: [
        {
          question: 'What is the risk-reward ratio for AAPL at current levels?',
          answer: 'Favorable 2.8:1 risk-reward profile, with primary support anchored at $220 and target objective at $255.'
        }
      ]
    }
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    currency: '$',
    price: 248.70,
    change: -5.40,
    changePercent: -2.12,
    open: 254.20,
    high: 256.00,
    low: 246.50,
    volume: '78.9M',
    avgVolume: '65.4M',
    marketCap: '$792B',
    peRatio: 64.2,
    week52High: 271.00,
    week52Low: 138.80,
    beta: 2.24,
    sector: 'Automotive & Clean Energy',
    aiRating: 'HOLD',
    aiConfidence: 71,
    targetPrice: 260.00,
    sparkline: [260, 258, 255, 252, 254, 251, 249, 248.70],
    chartData: generateChartData(248.70, 1.8),
    aiInsights: {
      recommendation: 'HOLD',
      confidence: 71,
      targetPrice: 260.00,
      projectedUpside: 4.54,
      riskLevel: 'HIGH',
      summary: 'Autonomous Cybercab and Megapack energy storage provide colossal long-term optionality, but near-term EV automotive gross margin compression and high multiple vulnerability warrant a wait-and-see stance.',
      catalysts: [
        'Energy storage business (Megapack deployments) surging 125% year-over-year at high double-digit margins.',
        'FSD V13 neural network end-to-end architecture progressing towards unsupervised commercial regulatory approvals.'
      ],
      downsideRisks: [
        'Intense price war in Chinese market leading to further automotive gross margin erosion.',
        'High valuation beta leaving stock susceptible to macroeconomic interest rate sentiment swings.'
      ],
      technicalSummary: 'Short-term pullback towards the 50-day SMA ($242.00). RSI has slipped to 44.5 (mild bearish divergence). We suggest accumulating only on a confirmed retest of $238 support.',
      sentiment: {
        score: 42,
        positive: 46,
        neutral: 24,
        negative: 30,
        label: 'Neutral',
        newsHeadlines: [
          {
            id: 't1',
            title: 'Tesla Energy Division Sets Record Deployment of 7.3 GWh in Recent Quarter',
            source: 'Electrek',
            time: '3h ago',
            sentiment: 'positive',
            impact: 'Medium',
            snippet: 'Utility-scale battery storage emerging as the fastest-growing earnings pillar.'
          },
          {
            id: 't2',
            title: 'EV Price Cuts Continue to Squeeze Automotive Operating Margins',
            source: 'CNBC Auto',
            time: '6h ago',
            sentiment: 'negative',
            impact: 'High',
            snippet: 'Analysts model modest margin compression ahead of mass-market platform volume production.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 44.5,
          status: 'Neutral to Oversold',
          description: 'Selling pressure easing near key technical pivot band.'
        },
        macd: {
          value: -0.85,
          signal: -0.40,
          histogram: -0.45,
          status: 'Bearish Divergence',
          description: 'MACD line crossing below signal line indicating short-term corrective phase.'
        },
        movingAverages: {
          ema20: 254.60,
          ema50: 242.30,
          ema200: 215.10,
          status: 'Testing Mid EMA',
          goldenCross: true
        },
        bollinger: {
          upper: 268.00,
          middle: 252.00,
          lower: 236.00,
          status: 'Approaching Lower Band'
        }
      },
      valuationCheck: {
        peComparison: 'Trading at 64x trailing P/E requires sustained execution on autonomous mobility revenue models.',
        intrinsicValue: 245.00,
        fairValueGap: 'Fairly valued near current market price.'
      },
      faq: [
        {
          question: 'Should I sell TSLA if I hold a profit?',
          answer: 'StockSense AI suggests setting a stop-loss at $235. If trading for swing momentum, taking partial 25% profits into rallies towards $265 is disciplined.'
        }
      ]
    }
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE (India)',
    currency: '₹',
    price: 1324.50,
    change: 18.25,
    changePercent: 1.40,
    open: 1308.00,
    high: 1332.00,
    low: 1305.50,
    volume: '11.8M',
    avgVolume: '9.4M',
    marketCap: '₹17.9T ($215B)',
    peRatio: 26.4,
    week52High: 1420.00,
    week52Low: 1115.00,
    beta: 0.88,
    sector: 'Conglomerate & Telecom/Retail',
    aiRating: 'STRONG BUY',
    aiConfidence: 91,
    targetPrice: 1540.00,
    sparkline: [1290, 1298, 1305, 1302, 1312, 1318, 1320, 1324.50],
    chartData: generateChartData(1324.50, 0.9),
    aiInsights: {
      recommendation: 'STRONG BUY',
      confidence: 91,
      targetPrice: 1540.00,
      projectedUpside: 16.27,
      riskLevel: 'LOW',
      summary: 'Indias undisputed market cap leader is undergoing a value-unlocking trifecta: impending Jio Infocomm telecom IPO, rapid 5G standalone monetisation, and green hydrogen clean energy mega-projects.',
      catalysts: [
        'Expected public listing of Jio Telecom unlocking substantial sum-of-the-parts (SOTP) shareholder value.',
        'Average Revenue Per User (ARPU) expansion across 480M Jio digital subscribers.',
        'Reliance Retail physical footprint expansion commanding dominant market share across grocery, electronics, and fashion.'
      ],
      downsideRisks: [
        'Gross Refining Margin (GRM) volatility in standard oil-to-chemicals (O2C) processing sector.',
        'Aggressive capital expenditure cycles in renewable energy gigafactories temporarily muting free cash flow.'
      ],
      technicalSummary: 'Stock has broken out of a 6-month symmetrical consolidation triangle on NSE. Bullish engulfing pattern on daily candlestick chart backed by 125% higher institutional volume.',
      sentiment: {
        score: 79,
        positive: 74,
        neutral: 20,
        negative: 6,
        label: 'Extremely Bullish',
        newsHeadlines: [
          {
            id: 'r1',
            title: 'Jio ARPU Rises to ₹195 as 5G Data Consumption Surpasses Global Averages',
            source: 'Economic Times',
            time: '45m ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Strong digital monetization signals healthy free cash flow ramp up across domestic telecom assets.'
          },
          {
            id: 'r2',
            title: 'Reliance Green Energy Giga-Complex to Begin Commercial Electrolyzer Production Ahead of Schedule',
            source: 'Business Standard',
            time: '3h ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Gujarat solar and green hydrogen complex positions firm at vanguard of Indian clean energy transition.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 63.8,
          status: 'Bullish Momentum',
          description: 'Constructive accumulation with steady institutional buying volume.'
        },
        macd: {
          value: 14.2,
          signal: 9.8,
          histogram: 4.4,
          status: 'Strong Bullish Histogram',
          description: 'Expanding positive histogram reflects strong upward acceleration.'
        },
        movingAverages: {
          ema20: 1302.00,
          ema50: 1278.50,
          ema200: 1220.00,
          status: 'Bullish Multi-EMA Stack',
          goldenCross: true
        },
        bollinger: {
          upper: 1345.00,
          middle: 1300.00,
          lower: 1255.00,
          status: 'Breaking into Upper Expansion'
        }
      },
      valuationCheck: {
        peComparison: 'At 26.4x P/E, Reliance trades at an attractive discount relative to global consumer tech peers.',
        intrinsicValue: 1560.00,
        fairValueGap: '+17.8% upside based on Sum-Of-The-Parts (SOTP) valuation.'
      },
      faq: [
        {
          question: 'What is the quantitative thesis for including Reliance in StockSense AI?',
          answer: 'Reliance provides crucial proof of concept for StockSense AI handling dual currencies ($ and ₹), cross-exchange feeds (NASDAQ vs NSE), and diverse valuation models (conglomerate SOTP vs pure tech).'
        }
      ]
    }
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: '$',
    price: 432.10,
    change: 3.40,
    changePercent: 0.79,
    open: 429.50,
    high: 434.80,
    low: 428.90,
    volume: '22.1M',
    avgVolume: '21.5M',
    marketCap: '$3.21T',
    peRatio: 36.1,
    week52High: 468.35,
    week52Low: 366.50,
    beta: 1.12,
    sector: 'Cloud & Enterprise Software',
    aiRating: 'BUY',
    aiConfidence: 89,
    targetPrice: 485.00,
    sparkline: [422, 424, 427, 425, 429, 430, 431, 432.10],
    chartData: generateChartData(432.10, 0.7),
    aiInsights: {
      recommendation: 'BUY',
      confidence: 89,
      targetPrice: 485.00,
      projectedUpside: 12.24,
      riskLevel: 'LOW',
      summary: 'Azure Cloud consumption accelerating with Copilot AI integration across Fortune 500 enterprise seats. Immense defensive moat backed by triple-A balance sheet credit rating.',
      catalysts: [
        'Azure revenue growth exceeding 29% in constant currency with 12 points attributed to AI workloads.',
        'M365 Copilot commercial adoption reaching 60% of enterprise customers.',
        'Gaming revenue boost following complete integration of Activision Blizzard franchises.'
      ],
      downsideRisks: [
        'Elevated CapEx spend for AI data center capacity weighing marginally on near-term operating cash margin.',
        'Antitrust scrutiny in cloud bundling practices by European regulators.'
      ],
      technicalSummary: 'Well-defined upward channel. Bounced off key 100-day moving average. MACD turning positive on weekly chart.',
      sentiment: {
        score: 73,
        positive: 70,
        neutral: 22,
        negative: 8,
        label: 'Bullish',
        newsHeadlines: [
          {
            id: 'm1',
            title: 'Microsoft Azure Secures Multi-Billion Enterprise Cloud AI Agreements',
            source: 'Financial Times',
            time: '2h ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Enterprise customers accelerate enterprise-grade OpenAI workload migrations into Azure.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 61.2,
          status: 'Healthy Bullish',
          description: 'Sustained buying interest without overextension.'
        },
        macd: {
          value: 1.84,
          signal: 1.20,
          histogram: 0.64,
          status: 'Bullish Divergence',
          description: 'Positive MACD momentum line trending above signal.'
        },
        movingAverages: {
          ema20: 426.80,
          ema50: 421.10,
          ema200: 395.40,
          status: 'Bullish Alignment',
          goldenCross: true
        },
        bollinger: {
          upper: 440.00,
          middle: 428.00,
          lower: 416.00,
          status: 'Trading in Upper Tier'
        }
      },
      valuationCheck: {
        peComparison: 'P/E of 36x is consistent with Microsoft historical 3-year median and justified by high return on invested capital (ROIC > 27%).',
        intrinsicValue: 478.00,
        fairValueGap: '+10.6% discount.'
      },
      faq: [
        {
          question: 'How resilient is MSFT in a market correction?',
          answer: 'MSFT holds one of only two AAA corporate credit ratings globally, providing premier institutional defensive support during market pullbacks.'
        }
      ]
    }
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    currency: '$',
    price: 172.60,
    change: 2.15,
    changePercent: 1.26,
    open: 170.80,
    high: 173.90,
    low: 170.10,
    volume: '28.3M',
    avgVolume: '24.9M',
    marketCap: '$2.14T',
    peRatio: 23.8,
    week52High: 191.75,
    week52Low: 129.40,
    beta: 1.08,
    sector: 'Internet & AI Cloud',
    aiRating: 'BUY',
    aiConfidence: 86,
    targetPrice: 205.00,
    sparkline: [168, 169, 167, 170, 171, 170, 171.5, 172.60],
    chartData: generateChartData(172.60, 1.1),
    aiInsights: {
      recommendation: 'BUY',
      confidence: 86,
      targetPrice: 205.00,
      projectedUpside: 18.77,
      riskLevel: 'MODERATE',
      summary: 'Google Cloud Platform (GCP) operating profitability inflection, proprietary Gemini multimodal models powering Search AI Overviews, and a very attractive 23.8x P/E multiple offer excellent margin of safety.',
      catalysts: [
        'Search AI Overviews increasing user engagement and monetizable query volumes.',
        'Google Cloud operating margins scaling to 11.5% with enterprise Vertex AI platform.',
        'Custom TPU v6e Ironwood chips reducing dependence on external GPU hardware and boosting internal cost efficiencies.'
      ],
      downsideRisks: [
        'US Department of Justice antitrust remedies concerning search distribution agreements.',
        'Ad spend cyclicality in European advertising markets.'
      ],
      technicalSummary: 'Double bottom reversal pattern completed at $162. Reclaiming 50-day EMA ($169.40) establishes bullish trajectory.',
      sentiment: {
        score: 71,
        positive: 68,
        neutral: 24,
        negative: 8,
        label: 'Bullish',
        newsHeadlines: [
          {
            id: 'g1',
            title: 'Gemini Multimodal Models Power High-Margin Google Cloud Enterprise Ingestion',
            source: 'VentureBeat',
            time: '1h ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Large enterprises migrate production AI workloads to Google Vertex AI cluster instances.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 59.7,
          status: 'Bullish Accumulation',
          description: 'Steady upward trendline with low volatility.'
        },
        macd: {
          value: 0.95,
          signal: 0.52,
          histogram: 0.43,
          status: 'Bullish Crossover',
          description: 'Expanding histogram bars signaling upward momentum.'
        },
        movingAverages: {
          ema20: 169.80,
          ema50: 168.20,
          ema200: 156.40,
          status: 'Above Key Averages',
          goldenCross: true
        },
        bollinger: {
          upper: 177.50,
          middle: 170.20,
          lower: 162.90,
          status: 'Mid-to-Upper Band Drift'
        }
      },
      valuationCheck: {
        peComparison: 'At 23.8x P/E, Alphabet trades at the most attractive valuation among the Magnificent Seven tech titans.',
        intrinsicValue: 208.00,
        fairValueGap: '+20.5% intrinsic discount.'
      },
      faq: [
        {
          question: 'How does Gemini AI evaluate Alphabet regulatory risks?',
          answer: 'StockSense AI quantitative stress-testing shows even under worst-case search revenue syndication splits, GCP and YouTube valuations provide a strong defensive floor at $155.'
        }
      ]
    }
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    exchange: 'NSE (India)',
    currency: '₹',
    price: 846.30,
    change: -12.40,
    changePercent: -1.44,
    open: 855.00,
    high: 861.00,
    low: 842.00,
    volume: '8.2M',
    avgVolume: '9.1M',
    marketCap: '₹3.1T ($37.2B)',
    peRatio: 9.8,
    week52High: 1179.00,
    week52Low: 635.00,
    beta: 1.42,
    sector: 'Automobile & EV Mobility',
    aiRating: 'BUY',
    aiConfidence: 83,
    targetPrice: 1050.00,
    sparkline: [870, 865, 860, 858, 852, 855, 850, 846.30],
    chartData: generateChartData(846.30, 1.4),
    aiInsights: {
      recommendation: 'BUY',
      confidence: 83,
      targetPrice: 1050.00,
      projectedUpside: 24.07,
      riskLevel: 'MODERATE',
      summary: 'Tata Motors commands >70% EV passenger vehicle market share in India, while Jaguar Land Rover (JLR) order book remains robust with strong cash generation driving zero net debt targets.',
      catalysts: [
        'Demerger of Commercial Vehicles (CV) and Passenger Vehicles (PV) creating two agile pure-play listed entities.',
        'JLR order book in premium Range Rover and Defender categories sustaining EBITDA margins above 15%.',
        'India EV charging infrastructure leadership and new Curvv EV launches.'
      ],
      downsideRisks: [
        'European luxury auto demand soft-patch affecting JLR wholesale deliveries.',
        'Raw material commodity price inflation in automotive steel and battery cells.'
      ],
      technicalSummary: 'Healthy retracement to 200-day EMA support zone near ₹840. Oversold RSI (38.5) suggests prime accumulation territory for value-oriented portfolios.',
      sentiment: {
        score: 62,
        positive: 60,
        neutral: 28,
        negative: 12,
        label: 'Bullish',
        newsHeadlines: [
          {
            id: 'tm1',
            title: 'Tata Motors Approves Demerger to Unlock Shareholder Value in Two Listed Units',
            source: 'Moneycontrol',
            time: '5h ago',
            sentiment: 'positive',
            impact: 'High',
            snippet: 'Strategic separation allows distinct capital allocation strategies for CV and PV segments.'
          }
        ]
      },
      indicators: {
        rsi: {
          value: 38.5,
          status: 'Oversold Accumulation',
          description: 'Approaching deep oversold territory; high historical probability of mean-reversion rally.'
        },
        macd: {
          value: -4.5,
          signal: -3.8,
          histogram: -0.7,
          status: 'Curving Towards Reversal',
          description: 'Histogram bottoming out as seller volume diminishes.'
        },
        movingAverages: {
          ema20: 865.00,
          ema50: 890.00,
          ema200: 838.00,
          status: 'At Critical 200-EMA Cushion',
          goldenCross: true
        },
        bollinger: {
          upper: 915.00,
          middle: 868.00,
          lower: 835.00,
          status: 'Bottom Band Touch'
        }
      },
      valuationCheck: {
        peComparison: 'Ultra-low single-digit P/E of 9.8x offers deep fundamental value margin vs global auto OEMs.',
        intrinsicValue: 1080.00,
        fairValueGap: '+27.6% valuation discount.'
      },
      faq: [
        {
          question: 'Why is Tata Motors an attractive buy now?',
          answer: 'The impending corporate demerger into separate listed entities typically unlocks 15-25% conglomerate discount, supported by JLR free cash flow turnaround.'
        }
      ]
    }
  }
];

export const MARKET_INDICES: MarketIndex[] = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: '5,864.67',
    numericPrice: 5864.67,
    change: '+32.40',
    changePercent: 0.56,
    sparkline: [5820, 5835, 5840, 5830, 5855, 5860, 5864.67]
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ 100',
    price: '18,518.61',
    numericPrice: 18518.61,
    change: '+142.15',
    changePercent: 0.77,
    sparkline: [18350, 18400, 18380, 18450, 18490, 18518.61]
  },
  {
    symbol: '^NSEI',
    name: 'NIFTY 50',
    price: '24,213.30',
    numericPrice: 24213.30,
    change: '+118.80',
    changePercent: 0.49,
    sparkline: [24050, 24100, 24080, 24150, 24190, 24213.30]
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    price: '$71,450.00',
    numericPrice: 71450.00,
    change: '+1,820.00',
    changePercent: 2.61,
    sparkline: [68900, 69400, 70100, 69800, 70900, 71450]
  },
  {
    symbol: 'CL=F',
    name: 'Crude Oil',
    price: '$70.85',
    numericPrice: 70.85,
    change: '-0.74',
    changePercent: -1.03,
    sparkline: [72.1, 71.8, 71.5, 71.2, 70.9, 70.85]
  }
];
