import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Droplet, 
  Activity, 
  ChevronRight, 
  Wallet, 
  Hospital,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { login, switchAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('donor');
  const [isConnecting, setIsConnecting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected! Please install the extension.");
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        const success = await login(address, role);
        
        if (success) {
          navigate(from, { replace: true });
        }
      } else {
        toast.error("No accounts found. Please unlock MetaMask.");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      if (error.code === 4001) {
        toast.error("Connection request was rejected.");
      } else {
        toast.error("An error occurred while connecting to MetaMask.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Heartbeat Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative z-10"
      >
        {/* Left Side: Branding & Info */}
        <div className="p-10 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-primary-600/10 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-primary-600 rounded-xl">
                <Droplet className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight italic">BloodChain</h1>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              A Pulse For <br />
              <span className="text-primary-500">Every Emergency.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              The world's first decentralized blood donation intelligence platform. Powered by blockchain, driven by community.
            </p>
          </div>

          <div className="space-y-6 mt-12">
            {[
              { icon: ShieldCheck, text: "Blockchain Verified Security" },
              { icon: Activity, text: "Real-time Emergency Feed" },
              { icon: Heart, text: "Life-saving Match Intelligence" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <item.icon size={18} className="text-primary-400" />
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 lg:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900">Welcome System</h3>
            <p className="text-slate-500 mt-2 font-medium">Select your portal to continue</p>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button
              onClick={() => setRole('donor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'donor' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Wallet size={18} /> Donor Hub
            </button>
            <button
              onClick={() => setRole('hospital')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'hospital' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Hospital size={18} /> Hospital Command
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-6 border-2 border-slate-100 rounded-3xl group hover:border-primary-100 hover:bg-primary-50/20 transition-all">
              <h4 className="font-bold text-slate-900 mb-1">Decentralized Login</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock your portal using your secure blockchain wallet address. No password required.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-primary-600 text-white shadow-xl shadow-slate-200 transition-all font-black text-lg"
              onClick={handleLogin}
              isLoading={isConnecting}
            >
              {isConnecting ? 'Establishing Link...' : 'Enter System'}
              {!isConnecting && <ChevronRight className="ml-2" size={20} />}
            </Button>

            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={switchAccount}
                className="text-primary-600 hover:text-primary-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Wallet size={14} />
                Switch Wallet Address
              </button>
              <p className="text-center text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
                By connecting, you agree to the BloodChain Protocol Terms.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Network Status</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Operational
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
