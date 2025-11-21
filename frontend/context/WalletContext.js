import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch wallet balance
  const fetchBalance = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.get('/wallet/balance');
      setWallet(response.data);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      toast.error('Failed to fetch wallet balance');
    } finally {
      setLoading(false);
    }
  };

  // Refresh wallet data
  const refresh = () => {
    fetchBalance();
  };

  // Fetch balance when user is available
  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const value = {
    wallet,
    loading,
    fetchBalance,
    refresh,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
