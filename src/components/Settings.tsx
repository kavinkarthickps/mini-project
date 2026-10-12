import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { StorageService } from '../lib/storage';
import { 
  User as UserIcon, 
  Globe, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  HardDrive, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  RefreshCw
} from 'lucide-react';

interface SettingsProps {
  onRefreshScans: () => void;
  onRefreshFields: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onRefreshScans, onRefreshFields }) => {
  const { user, language, setLanguage, signOutUser } = useAuth();
  const t = translations[language];

  const [defaultCrop, setDefaultCrop] = useState(() => localStorage.getItem('pestguard_default_crop') || 'Maize');
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSaveCrop = (crop: string) => {
    setDefaultCrop(crop);
    localStorage.setItem('pestguard_default_crop', crop);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to delete all saved scan history? This action cannot be undone.')) {
      localStorage.removeItem('pestguard_scans');
      onRefreshScans();
      alert('Scan history cleared successfully.');
    }
  };

  const handleClearAllStorage = () => {
    if (confirm('Reset all local caches and offline records to default?')) {
      localStorage.clear();
      onRefreshScans();
      onRefreshFields();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DDE6D5] pb-6 space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
          User Preferences & Security
        </span>
        <h1 className="text-3xl font-extrabold text-[#174D35]">
          Account & Portal Settings
        </h1>
        <p className="text-sm text-gray-600">
          Manage your agronomic preferences, offline storage caches, and privacy controls.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-[#63A66A]" />
          <span>User Profile</span>
        </h3>

        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-14 h-14 rounded-full object-cover border-2 border-[#63A66A]" 
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#174D35] text-white font-bold text-xl flex items-center justify-center">
              {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}

          <div>
            <h4 className="text-lg font-bold text-[#174D35]">
              {user?.displayName || 'Registered Agronomist'}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              {user?.email || 'Field Technician'}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Verified Firebase Auth Profile
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35]">
          Regional & Agronomic Preferences
        </h3>

        {/* Language Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <span className="text-xs font-bold text-gray-700 block">Preferred Interface Language</span>
            <p className="text-[11px] text-gray-500">English or Tamil (தமிழ்) translation for farmer usability</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                language === 'en' 
                  ? 'bg-[#174D35] text-white border-[#174D35]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              English (EN)
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                language === 'ta' 
                  ? 'bg-[#174D35] text-white border-[#174D35]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </div>

        {/* Default Crop Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs font-bold text-gray-700 block">Default Primary Crop</span>
            <p className="text-[11px] text-gray-500">Pre-populates new scan diagnostics and risk engine defaults</p>
          </div>
          <div>
            <select
              value={defaultCrop}
              onChange={(e) => handleSaveCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
            >
              <option value="Maize">Maize (Corn)</option>
              <option value="Rice">Rice (Paddy)</option>
              <option value="Tomato">Tomato</option>
              <option value="Cotton">Cotton</option>
              <option value="Chilli">Chilli</option>
              <option value="Brinjal">Brinjal (Eggplant)</option>
              <option value="Wheat">Wheat</option>
            </select>
            {saveNotice && (
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Default crop preference saved!</span>
            )}
          </div>
        </div>
      </div>

      {/* Offline Storage & Security Controls */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#63A66A]" />
          <span>Offline Data & Cache Controls</span>
        </h3>

        <div className="p-4 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] text-xs text-gray-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#174D35]">
            <Lock className="w-4 h-4 text-[#63A66A]" />
            <span>Zero-Trust Firestore Security Compliance</span>
          </div>
          <p className="leading-relaxed">
            All agricultural records and scan reports are strictly locked to your authenticated User ID (`request.auth.uid`). External clients cannot query or scrape records from other farm plots.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleClearHistory}
            className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Scan History</span>
          </button>

          <button
            onClick={handleClearAllStorage}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Cache</span>
          </button>
        </div>
      </div>

      {/* Account Exit */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-800">Sign Out of Field Session</h4>
          <p className="text-xs text-gray-500">End your current session on this device</p>
        </div>
        <button
          onClick={signOutUser}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-gray-500" />
          <span>{t.signOut}</span>
        </button>
      </div>

    </div>
  );
};
