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
  Check
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, forgotPassword, resetPassword } = useStock();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Forgot Password / Reset Flow State
  const [isForgotMode, setIsForgotMode] = useState<boolean>(false);
  const [resetStep, setResetStep] = useState<'SEND_OTP' | 'VERIFY_OTP'>('SEND_OTP');
  const [resetOtp, setResetOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: any;
    if (isForgotMode && resetStep === 'VERIFY_OTP' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isForgotMode, resetStep, countdown]);

  // Standard Direct Login / Signup (NO OTP required on regular login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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
      if (isLoginMode) {
        const res = await login(normEmail, normPass);
        if (!res.success) setErrorMessage(res.message);
      } else {
        const res = await signup(name.trim() || 'Trader', normEmail, normPass);
        if (!res.success) setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Send OTP to Email for Password Reset
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const normEmail = email.trim();
    if (!normEmail || !normEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(normEmail);
      if (res.success) {
        setResetStep('VERIFY_OTP');
        setCountdown(30);
        setSuccessMessage(`A 6-digit verification code has been dispatched to ${normEmail}.`);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch password reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const normEmail = email.trim();
    const cleanOtp = resetOtp.trim();
    const normNewPass = newPassword.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code sent to your email.');
      return;
    }

    if (!normNewPass || normNewPass.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(normEmail, cleanOtp, normNewPass);
      if (res.success) {
        setSuccessMessage('Password reset successfully! Logging you into your terminal...');
        // Automatically sign in with the new password
        await login(normEmail, normNewPass);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
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
            <span>INSTITUTIONAL QUANTITATIVE TERMINAL — CLIENT-SERVER VERIFIED</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              StockSense <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-lg text-slate-300 font-light max-w-xl leading-relaxed">
              Institutional-grade market intelligence platform combining real-time quantitative metrics with multimodal Gemini LLM sentiment synthesis.
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
                <h4 className="text-sm font-bold text-white">Multi-Asset & Dual Market</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless coverage across US Equities (NASDAQ/NYSE) and Indian Bluechips (NSE Reliance, Tata Motors).
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
              Email Password Reset Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              JSON Database Persistence
            </span>
          </div>
        </div>

        {/* Right Side: Auth / Forgot Password Card */}
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
                  {errorMessage.includes('No account found') && !isForgotMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(false);
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

            {/* Success banner if any */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-semibold text-emerald-200">{successMessage}</p>
              </div>
            )}

            {/* VIEW 1: FORGOT PASSWORD FLOW */}
            {isForgotMode ? (
              <div className="space-y-5 animate-fadeIn">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {resetStep === 'SEND_OTP' ? 'Reset Your Password' : 'Enter 6-Digit Email Code'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {resetStep === 'SEND_OTP'
                      ? 'Enter your registered email address. We will send a 6-digit OTP code to your inbox.'
                      : `A 6-digit verification code was sent to ${email}. Please check your inbox or spam folder.`}
                  </p>
                </div>

                {resetStep === 'SEND_OTP' ? (
                  /* Step 1: Submit email to get OTP */
                  <form onSubmit={handleSendResetOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Registered Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {isLoading ? 'Dispatching OTP to Email...' : 'Send OTP to My Mail'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotMode(false);
                          setResetStep('SEND_OTP');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-xs text-blue-400 hover:underline"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Verify OTP & Enter New Password */
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        6-Digit OTP Code (from your email)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={resetOtp}
                          onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 587861"
                          className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:border-brand-blue"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || resetOtp.length < 6}
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying & Updating...' : 'Reset Password & Enter Terminal'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        disabled={countdown > 0 || isLoading}
                        onClick={handleSendResetOtp}
                        className="text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-40"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend Code'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotMode(false);
                          setResetStep('SEND_OTP');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-blue-400 hover:underline"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* VIEW 2: REGULAR DIRECT SIGN IN / SIGN UP */
              <>
                {/* Toggle Switch */}
                <div className="flex p-1 bg-[#0B0F19] rounded-xl border border-slate-800 mb-6">
                  <button
                    type="button"
                    onClick={() => { setIsLoginMode(true); setErrorMessage(''); setSuccessMessage(''); }}
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
                    onClick={() => { setIsLoginMode(false); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      !isLoginMode
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotMode(true);
                            setResetStep('SEND_OTP');
                            setErrorMessage('');
                            setSuccessMessage('');
                          }}
                          className="text-[11px] text-brand-blue hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
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

                  {/* Direct Login Button (NO OTP required on normal login) */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>
                      {isLoading
                        ? 'Verifying with Server...'
                        : isLoginMode
                        ? 'Sign In with My Email'
                        : 'Create Personal Account & Fund $10,000'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client-Server Verified • Syncs to Express Backend</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
