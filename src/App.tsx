import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CreditCard, 
  Menu,
  Mic,
  MicOff,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import { storage } from './lib/storage';
import './i18n';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02]' 
        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
    <span className="font-bold tracking-tight">{label}</span>
  </Link>
);

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [voiceEnabled, setVoiceEnabled] = useState(storage.getSettings().voiceHints);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back Online - Syncing database");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Offline Mode - Changes saved locally");
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    storage.saveSettings({ ...storage.getSettings(), voiceHints: newState });
    speak(newState ? "Voice prompts activated" : "Voice prompts deactivated");
  };

  const speak = (text: string) => {
    if (voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/employees', icon: Users, label: t('employees') },
    { to: '/attendance', icon: Clock, label: t('attendance') },
    { to: '/payroll', icon: CreditCard, label: t('payroll') },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans selection:bg-primary/10 selection:text-primary">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-3">
            <Sparkles size={24} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 leading-none">
              ETHIO<span className="text-primary">HR</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Systems</span>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              active={location.pathname === item.to}
              onClick={() => setIsSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
          <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-2xl shadow-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('status')}</span>
              {isOnline ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 rounded-full">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tight">Offline</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {isOnline ? "Connected to secure cloud synchronization." : t('offlineMode')}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-8 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-2xl transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} className="text-slate-600" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              {navItems.find(i => i.to === location.pathname)?.label || t('dashboard')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleVoice}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${voiceEnabled ? 'bg-primary/10 text-primary scale-110 shadow-lg shadow-primary/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              title={t('voiceHints')}
            >
              {voiceEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <LanguageSwitcher speak={speak} />
            <div className="h-6 w-[1.5px] bg-slate-100 mx-2" />
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">Admin Control</p>
                <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-tighter">Verified Access</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-100 group-hover:scale-105 transition-transform">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 space-y-12">
          <Routes>
            <Route path="/" element={<Dashboard speak={speak} />} />
            <Route path="/employees" element={<EmployeeManagement speak={speak} />} />
            <Route path="/attendance" element={<Attendance speak={speak} />} />
            <Route path="/payroll" element={<Payroll speak={speak} />} />
          </Routes>
        </div>
      </main>

      <Toaster 
        position="bottom-right" 
        expand={false} 
        richColors 
        toastOptions={{
          style: { borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }
        }}
      />
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
