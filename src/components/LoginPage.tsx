import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { 
  Sprout, 
  Scan, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Camera, 
  ArrowLeft,
  User,
  Mail,
  Building,
  Info
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onGoHome: () => void;
  redirectNotice?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoHome, redirectNotice }) => {
  const { signInWithGoogle, signInAsDemoUser, language, setLanguage } = useAuth();
  const t = translations[language];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email / Agronomist direct sign-in form
  const [name, setName] = useState('Kavin Karthick');
  const [email, setEmail] = useState('kavinkarthickps@gmail.com');
  const [farmName, setFarmName] = useState('Green Valley Agro');
  const [activeTab, setActiveTab] = useState<'google' | 'agronomist'>('google');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed. Please try again or use direct field sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgronomistSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    signInAsDemoUser(name.trim(), email.trim());
    onSuccess();
  };

  const handleQuickDemo = () => {
    signInAsDemoUser('Kavin Karthick', 'kavinkarthickps@gmail.com');
    onSuccess();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F9F4] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-[#DDE6D5] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Agricultural Branding & Feature Highlights */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#174D35] via-[#1A573B] to-[#103726] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#63A66A]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#E68A19]/10 blur-3xl pointer-events-none" />

          {/* Top Back & Brand */}
          <div className="space-y-6 relative z-10">
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#A3C9A8] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Homepage</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#63A66A] to-[#43884A] shadow-md text-white">
                <Sprout className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E68A19] flex items-center justify-center border-2 border-[#174D35]">
                  <Scan className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  PestGuard<span className="text-[#63A66A]">AI</span>
                </h1>
                <p className="text-xs text-[#A3C9A8]">Precision Farming & Pest Intelligence</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Secure Agronomist Field Portal
              </h2>
              <p className="text-xs sm:text-sm text-[#D3E4D6] leading-relaxed">
                Log in to access your registered field plots, run real-time camera diagnostics, evaluate pest progression timelines, and generate verifiable IPM action plans.
              </p>
            </div>
          </div>

          {/* Value Highlights List */}
          <div className="space-y-3.5 py-8 border-y border-white/10 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Precision Vision AI Diagnostics</h3>
                <p className="text-[11px] text-[#A3C9A8]">Accurate taxonomic identification with verifiable morphological evidence.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Pest Risk Intelligence Engine</h3>
                <p className="text-[11px] text-[#A3C9A8]">Multi-scan historical progression modeling and growth stage vulnerability scoring.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Zero-Trust Cloud Firestore Security</h3>
                <p className="text-[11px] text-[#A3C9A8]">Field plots and scan documents strictly isolated per authenticated user.</p>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="flex items-center justify-between text-[11px] text-[#A3C9A8] pt-4 relative z-10">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#63A66A]" /> Firebase Authentication
            </span>
            <span>Cloud Firestore Verified</span>
          </div>

        </div>

        {/* Right Column: Sign In Forms */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            
            {/* Top Language & Heading */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#63A66A]">
                  Authentication
                </span>
                <h3 className="text-2xl font-extrabold text-[#174D35] mt-0.5">
                  Sign In to PestGuard
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-[#F7F9F4] border border-[#CADBCB] rounded-lg p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    language === 'en' ? 'bg-[#174D35] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    language === 'ta' ? 'bg-[#174D35] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            {redirectNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#174D35] leading-relaxed flex items-start gap-2.5 shadow-xs">
                <Lock className="w-4 h-4 text-[#174D35] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Authentication Required</span>
                  <span className="text-gray-700">{redirectNotice}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tab switch between Google Sign In and Agronomist Direct Form */}
            <div className="flex bg-[#F7F9F4] p-1 rounded-xl border border-gray-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('google')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'google' 
                    ? 'bg-white text-[#174D35] shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Google Authentication
              </button>
              <button
                onClick={() => setActiveTab('agronomist')}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'agronomist' 
                    ? 'bg-white text-[#174D35] shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Agronomist Profile Sign In
              </button>
            </div>

            {/* TAB 1: Real Google Sign In */}
            {activeTab === 'google' ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Sign in using your verified Google Account to synchronize crop diagnostics, field plots, and live camera session logs.
                </p>

                {/* Main Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3.5 px-4 flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-[#63A66A] rounded-2xl shadow-xs hover:bg-gray-50 active:bg-gray-100 font-bold text-sm text-gray-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{loading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-gray-200"></div>
                  <span className="shrink mx-3 text-gray-400 text-[10px] uppercase font-bold tracking-wider">Fast Field Demo Access</span>
                  <div className="grow border-t border-gray-200"></div>
                </div>

                {/* Instant Agronomist Demo Sign In */}
                <button
                  onClick={handleQuickDemo}
                  className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-[#F7F9F4] hover:bg-[#EEF2E6] text-[#174D35] border border-[#CADBCB] rounded-2xl font-bold text-xs transition-colors cursor-pointer group"
                >
                  <span>One-Click Agronomist Access (Kavin Karthick)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#63A66A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              /* TAB 2: Direct Agronomist Profile Form */
              <form onSubmit={handleAgronomistSignIn} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Agronomist / Farmer Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kavin Karthick"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kavinkarthickps@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Farm Organization / Station (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Green Valley Farm Cluster"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#174D35] hover:bg-[#1f5e42] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In as Field Agronomist</span>
                  <ArrowRight className="w-4 h-4 text-[#63A66A]" />
                </button>
              </form>
            )}

          </div>

          {/* Bottom Security Notice */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Encrypted Session Persistence</span>
            <span>GDPR & Agronomic Data Privacy</span>
          </div>

        </div>

      </div>
    </div>
  );
};
