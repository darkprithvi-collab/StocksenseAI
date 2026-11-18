import React, { useState, useEffect } from 'react';
import { useStock } from '../../context/StockContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User as UserIcon,
  Zap,
  BarChart3,
  Bot,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Check,
  ShieldAlert
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, sendOtp, verifyOtp } = useStock();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 2FA OTP State
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [dispatchedOtp, setDispatchedOtp] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);

  // Timer countdown for resending OTP
  useEffect(() => {
    let timer: any;
    if (isOtpStep && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, countdown]);

  // Request OTP from Backend
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const normEmail = email.trim();
    const normPass = password.trim();

    if (!normEmail) {
      setErrorMessage('Please enter your personal email address.');
      return;
    }

    if (!normPass) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp({
        email: normEmail,
        password: normPass,
        isLogin: isLoginMode,
        name: name.trim() || undefined
      });

      if (res.success) {
        setIsOtpStep(true);
        if (res.otp) {
          setDispatchedOtp(res.otp);
        }
        setCountdown(30);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch security code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Password Login (Skip 2FA if desired for quick viva demo)
  const handleDirectLogin = async () => {
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      if (isLoginMode) {
        const res = await login(email.trim(), password.trim());
        if (!res.success) setErrorMessage(res.message);
      } else {
        const res = await signup(name.trim() || 'Trader', email.trim(), password.trim());
        if (!res.success) setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify submitted 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanOtp = otpCode.trim();
    if (cleanOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit security OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtp(email.trim(), cleanOtp);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoVivaLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login('alex.vance@stocksense.ai', 'password123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] bg-grid-pattern relative flex flex-col justify-center items-center px-4 py-12 selection:bg-brand-blue/30 selection:text-white">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-blue/15 via-brand-indigo/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Pitch & Project Overview */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-semibold text-brand-blue tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>INSTITUTIONAL QUANTITATIVE TERMINAL — 2FA SECURED</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              StockSense <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-lg text-slate-300 font-light max-w-xl leading-relaxed">
              Institutional-grade market intelligence platform combining real-time quantitative metrics with multimodal Gemini LLM sentiment synthesis and 2FA authentication.
            </p>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl">
            <div className="p-4 rounded-xl bg-[#131B2E]/80 border border-slate-800 backdrop-blur-md space-y-1.5 hover:border-brand-blue/40 transition-colors">
              <div className="flex items-center gap-2 text-brand-blue">
                <Bot className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">Gemini 1.5 Pro AI Engine</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated sentiment extraction, RSI/MACD divergence parsing, and structured Buy/Hold/Sell rationale.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131B2E]/80 border border-slate-800 backdrop-blur-md space-y-1.5 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">$10,000 Virtual Portfolio</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-risk paper trading simulator with instant fills, live P&L ledger, and audit log.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131B2E]/80 border border-slate-800 backdrop-blur-md space-y-1.5 hover:border-indigo-400/40 transition-colors">
              <div className="flex items-center gap-2 text-indigo-400">
                <BarChart3 className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">Client-Server Ledger</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Persistent server records saved to database.json via Express REST API on Port 5000.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131B2E]/80 border border-slate-800 backdrop-blur-md space-y-1.5 hover:border-emerald-400/40 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">Two-Factor Authentication</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographic 6-digit email OTP verification preventing unauthorized brokerage access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Express Backend Active
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2FA Security Active
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              JSON Database Persistence
            </span>
          </div>
        </div>

        {/* Right Side: Auth / 2FA Card */}
        <div className="lg:col-span-5">
          <div className="relative bg-[#111827]/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            
            {/* Quick Demo Access banner */}
            <div className="mb-6 p-3 bg-gradient-to-r from-brand-blue/20 via-indigo-500/20 to-emerald-500/20 border border-brand-blue/40 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Quick Instant Access
                  </p>
                  <p className="text-[11px] text-slate-300">Launch with pre-funded demo account</p>
                </div>
                <button
                  type="button"
                  onClick={handleDemoVivaLogin}
                  className="px-3 py-1.5 text-xs font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center gap-1"
                >
                  Quick Launch <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-200">{errorMessage}</p>
                  {errorMessage.includes('No account found') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(false);
                        setIsOtpStep(false);
                        setErrorMessage('');
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium block"
                    >
                      Click here to switch to Create Account →
                    </button>
                  )}
                  {errorMessage.includes('already exists') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(true);
                        setIsOtpStep(false);
                        setErrorMessage('');
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium block"
                    >
                      Click here to switch to Sign In →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* VIEW A: 2FA OTP VERIFICATION SCREEN */}
            {isOtpStep ? (
              <div className="space-y-5 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-blue to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Two-Factor Authentication</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    A 6-digit security verification code has been dispatched to{' '}
                    <span className="text-blue-400 font-semibold">{email}</span>
                  </p>
                </div>

                {/* Simulated Email / Viva Demonstration Banner */}
                {dispatchedOtp && (
                  <div 
                    onClick={() => setOtpCode(dispatchedOtp)}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl cursor-pointer hover:bg-emerald-500/15 transition-all text-center space-y-1"
                  >
                    <p className="text-[11px] text-emerald-300 flex items-center justify-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Email Passcode Dispatched:
                    </p>
                    <div className="text-xl font-mono font-extrabold text-emerald-300 tracking-widest">
                      {dispatchedOtp}
                    </div>
                    <p className="text-[10px] text-emerald-400/80">Click here to auto-fill code</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 block text-center">
                      Enter 6-Digit Passcode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 bg-[#0B0F19] border border-brand-blue/50 rounded-xl text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Verifying 2FA Code...'
                    ) : (
                      <>
                        <span>Confirm & Enter Terminal</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      disabled={countdown > 0 || isLoading}
                      onClick={() => handleRequestOtp()}
                      className="text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-40"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpStep(false);
                        setOtpCode('');
                        setErrorMessage('');
                      }}
                      className="text-blue-400 hover:underline"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* VIEW B: EMAIL & PASSWORD CREDENTIALS SCREEN */
              <>
                {/* Toggle Switch */}
                <div className="flex p-1 bg-[#0B0F19] rounded-xl border border-slate-800 mb-6">
                  <button
                    type="button"
                    onClick={() => { setIsLoginMode(true); setErrorMessage(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      isLoginMode
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLoginMode(false); setErrorMessage(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      !isLoginMode
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-4">
                  {/* Name field: visible on Sign Up OR optional on Sign In */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300">
                        {isLoginMode ? 'Your Name (Optional)' : 'Full Name'}
                      </label>
                      {isLoginMode && (
                        <span className="text-[10px] text-slate-500">Auto-detected from email if blank</span>
                      )}
                    </div>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required={!isLoginMode}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isLoginMode ? "e.g. Prithviraj (leave blank to auto-detect)" : "e.g. Prithviraj"}
                        className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  {/* Personal Email field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Personal Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. darkprithvi@gmail.com"
                        className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-slate-300">Password</label>
                      {isLoginMode && (
                        <span 
                          onClick={() => {
                            setEmail('darkprithvi@gmail.com');
                            setPassword('password123');
                            setErrorMessage('');
                          }} 
                          className="text-[11px] text-brand-blue hover:underline cursor-pointer"
                        >
                          Fill Prithviraj
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Button: 2FA OTP Verification */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>
                      {isLoading
                        ? 'Dispatching 2FA Code...'
                        : isLoginMode
                        ? 'Send OTP to Mail & Verify (2FA)'
                        : 'Send OTP & Register Account'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Secondary 1-Click Direct Login */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleDirectLogin}
                      className="text-xs text-slate-400 hover:text-slate-200 underline"
                    >
                      Or sign in directly without 2FA →
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>2FA Protected • Client-Server Verified on Port 5000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
