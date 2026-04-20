import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bell, Menu, User, Volume2, VolumeX, Shield, Droplet } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, preferences, updatePreferences, switchAccount } = useAuth();
  
  const truncateAddress = (addr) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Not Connected";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Droplet className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
            BloodChain
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search network..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-50/50 rounded-xl text-sm transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Preference Toggles */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button 
            onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
            className={`p-1.5 rounded-lg transition-all ${preferences.soundEnabled ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}
            title="Toggle Sound Alerts"
          >
            {preferences.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button 
            onClick={() => updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
            className={`p-1.5 rounded-lg transition-all ${preferences.notificationsEnabled ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}
            title="Toggle Emergency Notifications"
          >
            <Bell size={16} />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-100 mx-1"></div>
        
        <div className="flex items-center gap-3 p-1.5 pr-3 bg-slate-50 border border-slate-100 rounded-xl relative group">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-primary-200">
            <Shield size={18} />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[10px] font-black uppercase tracking-widest text-primary-600 leading-none mb-1">
              {user?.role === 'hospital' ? 'Facility' : 'Verified Donor'}
            </div>
            <div className="text-xs font-bold text-slate-900 tabular-nums">
              {truncateAddress(user?.address)}
            </div>
          </div>
          
          {/* Switch Wallet Action */}
          <button 
            onClick={switchAccount}
            className="absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            title="Switch MetaMask Account"
          >
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <VolumeX size={14} className="rotate-45" /> {/* Using VolumeX as a placeholder for a 'switch' icon if needed, or something similar */}
              <svg 
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                className="transform"
              >
                <path d="M16 3h5v5" />
                <path d="M8 21H3v-5" />
                <path d="M15 15l6 6" />
                <path d="M9 9l-6-6" />
                <path d="M21 3l-9 9" />
                <path d="M3 21l9-9" />
              </svg>
            </motion.div>
          </button>
        </div>
      </div>
    </header>
  );
}
