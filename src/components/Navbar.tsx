import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { 
  Scan, 
  Sprout, 
  ShieldCheck, 
  Activity, 
  BookOpen, 
  History, 
  MapPin, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  Globe, 
  Wifi, 
  WifiOff, 
  User as UserIcon,
  PlusCircle,
  FileText,
  Camera,
  ChevronDown,
  Layers,
  Settings as SettingsIcon,
  Sparkles,
  Lock
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSignInModal: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openSignInModal, isOnline }) => {
  const { user, language, setLanguage, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const isToolActive = ['fields', 'history', 'library', 'planner'].includes(currentTab);

  return (
    <header className="sticky top-0 z-40 bg-[#154630]/95 backdrop-blur-md text-white shadow-md border-b border-[#235E42]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Left: Brand & Logo */}
          <div 
            onClick={() => handleNavClick(user ? 'dashboard' : 'home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#63A66A] to-[#397841] shadow-md text-white group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E68A19] flex items-center justify-center border-2 border-[#154630]">
                <Scan className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  PestGuard<span className="text-[#63A66A]">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#205E40] text-[#A3C9A8] border border-[#2b7853]">
                  Vision
                </span>
              </div>
              <p className="text-[10px] text-[#A3C9A8] hidden md:block leading-tight mt-0.5 font-medium">
                Crop Pest Diagnostics & IPM
              </p>
            </div>
          </div>

          {/* 2. Center: Primary Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {!user ? (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'home' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                >
                  {t.navHome}
                </button>

                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'dashboard' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                  title="Agronomist Dashboard (Sign in to enter)"
                >
                  <Activity className="w-3.5 h-3.5 text-[#63A66A]" />
                  <span>{t.navDashboard}</span>
                  <Lock className="w-3 h-3 text-[#A3C9A8]/70" />
                </button>

                <button
                  onClick={() => handleNavClick('detect')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'detect' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                  title="Pest & Disease Diagnostic Scan (Sign in to enter)"
                >
                  <Scan className="w-3.5 h-3.5 text-[#63A66A]" />
                  <span>{t.navDetect}</span>
                  <Lock className="w-3 h-3 text-[#A3C9A8]/70" />
                </button>

                <button
                  onClick={() => handleNavClick('camera')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'camera'
                      ? 'bg-[#103726] text-white border border-[#63A66A] shadow-xs'
                      : 'text-[#A3C9A8] hover:text-white hover:bg-[#1c553a]'
                  }`}
                  title="Live Camera Inspection (Sign in to enter)"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.navLiveInspect}</span>
                  <Lock className="w-3 h-3 text-emerald-400/80" />
                </button>

                <button
                  onClick={() => handleNavClick('intelligence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'intelligence' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                  title="Field Intelligence & GPS Mapping (Sign in to enter)"
                >
                  <span>{t.navIntelligence}</span>
                  <Lock className="w-3 h-3 text-[#A3C9A8]/70" />
                </button>

                <button
                  onClick={() => handleNavClick('library')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'library' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                  title="Pest & Disease Library (Sign in to enter)"
                >
                  <span>{t.navLibrary}</span>
                  <Lock className="w-3 h-3 text-[#A3C9A8]/70" />
                </button>
              </>
            ) : (
              <>
                {/* Authenticated Links: Clean & uncluttered */}
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'dashboard' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                >
                  {t.navDashboard}
                </button>

                <button
                  onClick={() => handleNavClick('detect')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'detect' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5 text-[#63A66A]" />
                  <span>{t.navDetect}</span>
                </button>

                <button
                  onClick={() => handleNavClick('camera')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'camera'
                      ? 'bg-[#103726] text-white border border-[#63A66A] shadow-xs'
                      : 'text-[#A3C9A8] hover:text-white hover:bg-[#1c553a]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.navLiveInspect}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>

                <button
                  onClick={() => handleNavClick('intelligence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'intelligence' 
                      ? 'bg-[#226343] text-white shadow-xs font-bold' 
                      : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-[#63A66A]" />
                  <span>{t.navIntelligence}</span>
                </button>

                {/* Field Modules Dropdown Menu */}
                <div className="relative" ref={toolsRef}>
                  <button
                    onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isToolActive || toolsDropdownOpen
                        ? 'bg-[#226343] text-white font-bold' 
                        : 'text-[#D3E4D6] hover:bg-[#1c553a] hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#63A66A]" />
                    <span>Modules</span>
                    <ChevronDown className={`w-3 h-3 text-[#A3C9A8] transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button
                        onClick={() => handleNavClick('fields')}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#F7F9F4] flex items-center gap-2.5 transition-colors cursor-pointer ${
                          currentTab === 'fields' ? 'text-[#174D35] font-bold bg-[#EEF2E6]' : 'text-gray-700'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#63A66A]" />
                        <div>
                          <div className="font-semibold">{t.navFields}</div>
                          <div className="text-[10px] text-gray-400">Crop plots & history</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('history')}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#F7F9F4] flex items-center gap-2.5 transition-colors cursor-pointer ${
                          currentTab === 'history' ? 'text-[#174D35] font-bold bg-[#EEF2E6]' : 'text-gray-700'
                        }`}
                      >
                        <History className="w-4 h-4 text-[#63A66A]" />
                        <div>
                          <div className="font-semibold">{t.navHistory}</div>
                          <div className="text-[10px] text-gray-400">Archived field reports</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('library')}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#F7F9F4] flex items-center gap-2.5 transition-colors cursor-pointer ${
                          currentTab === 'library' ? 'text-[#174D35] font-bold bg-[#EEF2E6]' : 'text-gray-700'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-[#63A66A]" />
                        <div>
                          <div className="font-semibold">{t.navLibrary}</div>
                          <div className="text-[10px] text-gray-400">Entomology directory</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('planner')}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#F7F9F4] flex items-center gap-2.5 transition-colors cursor-pointer ${
                          currentTab === 'planner' ? 'text-[#174D35] font-bold bg-[#EEF2E6]' : 'text-gray-700'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-[#63A66A]" />
                        <div>
                          <div className="font-semibold">{t.navPlanner}</div>
                          <div className="text-[10px] text-gray-400">5-Pillar IPM Protocols</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* 3. Right: Utility Controls & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Online / Offline Pill */}
            <div 
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#103726] border border-[#216143] text-[10px] font-semibold text-[#A3C9A8]"
              title={isOnline ? t.onlineMode : t.offlineMode}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              <span className="hidden xl:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#103726] border border-[#216143] rounded-lg p-0.5 text-[11px] font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-[#63A66A] text-[#174D35] font-bold shadow-xs' : 'text-[#A3C9A8] hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  language === 'ta' ? 'bg-[#63A66A] text-[#174D35] font-bold shadow-xs' : 'text-[#A3C9A8] hover:text-white'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            {/* User Profile or Sign In / Login Page CTA */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-[#103726] border border-[#216143] hover:bg-[#1a4a34] transition-all cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-6 h-6 rounded-full object-cover border border-[#63A66A]" 
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#63A66A] flex items-center justify-center text-[#174D35] font-bold text-xs">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-white max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#A3C9A8]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#174D35] truncate">{user.displayName || 'Farmer'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-[#F7F9F4] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-gray-500" />
                      <span>{t.navDashboard}</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('settings')}
                      className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-[#F7F9F4] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <SettingsIcon className="w-3.5 h-3.5 text-gray-500" />
                      <span>{t.navSettings}</span>
                    </button>

                    <button
                      onClick={() => {
                        signOutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium border-t border-gray-100 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {/* Dedicated Login Page Link */}
                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'login'
                      ? 'bg-[#226343] text-white border border-[#398059]'
                      : 'text-[#D3E4D6] hover:text-white hover:bg-[#1c553a]'
                  }`}
                  title="Open Full Login & Sign In Page"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#63A66A]" />
                  <span className="hidden sm:inline">Login</span>
                </button>

                {/* Quick Google Sign In Modal Button */}
                <button
                  onClick={openSignInModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#174D35] bg-[#63A66A] hover:bg-[#74b87b] shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-[#D3E4D6] hover:text-white hover:bg-[#216143] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#103726] border-t border-[#216143] px-4 pt-3 pb-5 space-y-1.5 shadow-xl">
          {!user ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34]"
              >
                {t.navHome}
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#63A66A]" />
                  <span>{t.navDashboard}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#205E40] text-[#A3C9A8]">Requires Login</span>
              </button>
              <button
                onClick={() => handleNavClick('camera')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-[#1a4a34] text-emerald-400 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>{t.navLiveInspect}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#205E40] text-[#A3C9A8] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Requires Login
                </span>
              </button>
              <button
                onClick={() => handleNavClick('detect')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-[#63A66A]" />
                  <span>{t.navDetect}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#205E40] text-[#A3C9A8] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Requires Login
                </span>
              </button>
              <button
                onClick={() => handleNavClick('intelligence')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#63A66A]" />
                  <span>{t.navIntelligence}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#205E40] text-[#A3C9A8] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Requires Login
                </span>
              </button>
              <button
                onClick={() => handleNavClick('library')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#63A66A]" />
                  <span>{t.navLibrary}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#205E40] text-[#A3C9A8] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Requires Login
                </span>
              </button>
              <div className="pt-2 border-t border-[#216143] space-y-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#377a56] bg-[#1a4a34] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-[#20583e]"
                >
                  <LogIn className="w-4 h-4 text-[#63A66A]" />
                  <span>Farmer & Agronomist Login Page</span>
                </button>
                <button
                  onClick={() => {
                    openSignInModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#63A66A] text-[#174D35] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-[#72b779]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Quick Sign In</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34]"
              >
                {t.navDashboard}
              </button>
              <button
                onClick={() => handleNavClick('camera')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-[#1a4a34] text-emerald-400 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>{t.navLiveInspect}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-black">Live</span>
              </button>
              <button
                onClick={() => handleNavClick('detect')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#174D35] bg-[#63A66A] flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {t.scanCropBtn}
              </button>
              <button
                onClick={() => handleNavClick('intelligence')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-[#63A66A]" />
                {t.navIntelligence}
              </button>
              <button
                onClick={() => handleNavClick('fields')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#63A66A]" />
                {t.navFields}
              </button>
              <button
                onClick={() => handleNavClick('history')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center gap-2"
              >
                <History className="w-4 h-4 text-[#63A66A]" />
                {t.navHistory}
              </button>
              <button
                onClick={() => handleNavClick('library')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#63A66A]" />
                {t.navLibrary}
              </button>
              <button
                onClick={() => handleNavClick('planner')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#63A66A]" />
                {t.navPlanner}
              </button>
              <button
                onClick={() => handleNavClick('settings')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1a4a34] flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4 text-[#63A66A]" />
                {t.navSettings}
              </button>
              <div className="pt-2 border-t border-[#216143]">
                <button
                  onClick={() => {
                    signOutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-left text-xs text-red-300 hover:bg-[#1a4a34] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.signOut}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
