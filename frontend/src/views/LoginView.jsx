import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, KeyRound, UserPlus, LogIn, Mail, ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInAsDemoDirector,
    loading: authLoading,
    authError,
    authNotice,
    isSupabaseConfigured,
    clearMessages
  } = useAuth();

  // Mode: 'signin' | 'signup' | 'reset'
  const [mode, setMode] = useState('signin');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setLocalError('');
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res.success) {
          if (onLogin) onLogin();
        }
      } else if (mode === 'signup') {
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        const res = await signUpWithEmail(email, password, fullName);
        if (res?.success) {
          if (onLogin) onLogin();
        }
      } else if (mode === 'reset') {
        await resetPassword(email);
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDirectorLogin = async () => {
    setIsSubmitting(true);
    setLocalError('');
    try {
      const res = await signInAsDemoDirector();
      if (res.success && onLogin) {
        onLogin();
      }
    } catch (err) {
      setLocalError('Quick director login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070B14] relative overflow-hidden font-sans select-none p-4 sm:p-6">
      {/* Dynamic Background Elements & Light Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-700/20 blur-[140px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-700/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300">
        
        {/* Supabase Status Indicator Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
              {isSupabaseConfigured ? 'Supabase Auth Engine' : 'MoSPI Secure Auth'}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
            TLS 1.3 / AES-256
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 mb-3 shadow-lg shadow-purple-600/30 border border-white/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            PAIMANA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Infrastructure & Project Monitoring Division (MoSPI)
          </p>
        </div>

        {/* Auth Mode Tabs Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('signin')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('reset')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'reset'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Global Notices & Alerts */}
        {(authError || localError) && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authError || localError}</span>
          </div>
        )}

        {authNotice && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authNotice}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">Officer Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserPlus className="h-4 h-4" />
                </div>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Dr. Rajesh Kumar"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 ml-1">Work Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="director@mospi.gov.in"
              />
            </div>
          </div>

          {/* Password Input (Sign In / Sign Up) */}
          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('reset')}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || authLoading}
            className="relative w-full mt-2 py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/30 overflow-hidden transition-all duration-300 disabled:opacity-70 flex justify-center items-center group"
          >
            {(isSubmitting || authLoading) ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <span className="relative z-10">
                  {mode === 'signin' && 'Authenticate & Access Cockpit'}
                  {mode === 'signup' && 'Create MoSPI Officer Account'}
                  {mode === 'reset' && 'Dispatch Reset Instructions'}
                </span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Director Access Divider */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={handleQuickDirectorLogin}
            disabled={isSubmitting || authLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium text-xs transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Quick 1-Click Director Access (Evaluator Mode)</span>
          </button>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-500" />
            Row-Level Security (RLS) & Multi-Tenant Isolation
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
