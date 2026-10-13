import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { X, ShieldCheck, Lock, Sprout, CheckCircle2, ArrowRight } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle, signInAsDemoUser, language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsDemoUser('Kavin Karthick', 'kavinkarthickps@gmail.com');
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header pattern */}
        <div className="bg-[#174D35] px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-[#A3C9A8] hover:text-white hover:bg-[#216143] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#63A66A] flex items-center justify-center text-white shadow-inner">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{t.brandName}</h3>
              <p className="text-xs text-[#A3C9A8]">Agronomic Intelligence & Field Portal</p>
            </div>
          </div>
          <p className="text-xs text-[#D3E4D6] mt-2">
            Sign in to store field scans, track pest progression timelines, and receive precision monitoring alerts.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Real Google Auth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 flex items-center justify-center gap-3 border border-gray-300 rounded-xl shadow-xs hover:bg-gray-50 active:bg-gray-100 font-medium text-sm text-gray-700 transition-all cursor-pointer disabled:opacity-50"
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
            <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="shrink mx-3 text-gray-400 text-xs uppercase font-medium">Or quick demo</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          {/* Quick Custom Field Login */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Farmer Name (e.g. Kavin Karthick)"
                id="custom-name-input"
                defaultValue="Kavin Karthick"
                className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-gray-300"
              />
              <input
                type="email"
                placeholder="Email Address"
                id="custom-email-input"
                defaultValue="kavinkarthickps@gmail.com"
                className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-gray-300"
              />
            </div>
            <button
              onClick={() => {
                const nameEl = document.getElementById('custom-name-input') as HTMLInputElement;
                const emailEl = document.getElementById('custom-email-input') as HTMLInputElement;
                signInAsDemoUser(nameEl?.value || 'Kavin Karthick', emailEl?.value || 'kavinkarthickps@gmail.com');
                onSuccess?.();
                onClose();
              }}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-[#174D35] hover:bg-[#1f5e42] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Sign In as Agronomist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Value points */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-[#63A66A] shrink-0 mt-0.5" />
              <span>Full Cloud Firestore synchronization across devices</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-[#63A66A] shrink-0 mt-0.5" />
              <span>Offline field scan caching for remote rural zones</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <Lock className="w-4 h-4 text-[#63A66A] shrink-0 mt-0.5" />
              <span>Zero-Trust security rules protect private farm plots</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
