import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    soundEnabled: true,
    notificationsEnabled: true
  });

  // Persist session and listen for MetaMask changes
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bloodchain_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedPrefs = localStorage.getItem('bloodchain_prefs');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error("Failed to load session from storage:", e);
      localStorage.removeItem('bloodchain_user');
    }

    // MetaMask Listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const currentAddress = accounts[0].toLowerCase();
          const storedUser = JSON.parse(localStorage.getItem('bloodchain_user') || '{}');
          
          // Only update if the address has actually changed to avoid re-render loops
          if (storedUser.address?.toLowerCase() !== currentAddress) {
            console.log("Account change detected:", currentAddress);
            const newUser = { ...storedUser, address: currentAddress };
            setUser(newUser);
            localStorage.setItem('bloodchain_user', JSON.stringify(newUser));
            if (storedUser.address) {
              toast.success("Wallet account switched!");
            }
          }
        } else {
          // Only logout if we were previously logged in
          const storedUser = localStorage.getItem('bloodchain_user');
          if (storedUser) {
            logout();
          }
        }
      };

      const handleChainChanged = (hexChainId) => {
        // Only reload if the chain is actually different from our expected one
        const numericId = parseInt(hexChainId, 16);
        if (numericId !== 1337) {
          console.log("Chain change detected, reloading...");
          window.location.reload();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Immediate reconciliation with current MetaMask account
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(err => {
          console.error("Failed to get initial accounts:", err);
          setLoading(false);
        });

      setLoading(false);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }

    setLoading(false);
  }, []);

  const login = async (walletAddress, role = 'donor') => {
    try {
      // In a real app, you'd verify the signature here
      const userData = {
        address: walletAddress,
        role: role,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('bloodchain_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${role === 'hospital' ? 'Facilty Admin' : 'Donor'}!`);
      return true;
    } catch (error) {
      toast.error("Failed to authenticate wallet");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodchain_user');
    toast.success("Logged out successfully");
  };

  const switchAccount = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected");
      return;
    }
    
    try {
      // Force MetaMask to show account selection dialog
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      
      // Explicitly request accounts to ensure synchronization
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        handleAccountsChanged(accounts);
      }
    } catch (error) {
      console.error("Failed to switch account:", error);
      if (error.code === 4001) {
        toast.error("Account switch cancelled");
      } else {
        toast.error("Failed to request account change");
      }
    }
  };

  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('bloodchain_prefs', JSON.stringify(updated));
  };

  const playSound = (type = 'notification') => {
    if (!preferences.soundEnabled) return;
    
    // Low-fi fallback using Web Audio API for a professional "SaaS" feel without needing external assets
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'emergency') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      } else if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      }

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio Context failed:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      switchAccount,
      preferences, 
      updatePreferences,
      playSound,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
