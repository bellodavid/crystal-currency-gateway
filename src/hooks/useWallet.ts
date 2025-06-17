
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface WalletBalance {
  USDT: number;
  [currency: string]: number;
}

interface WalletHook {
  isConnected: boolean;
  address: string | null;
  balance: WalletBalance;
  network: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWallet = (): WalletHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network] = useState('Hedera Testnet');
  const [balance, setBalance] = useState<WalletBalance>({
    USDT: 1500.50,
    NGN: 250000.00,
    KES: 15000.00,
    GHS: 8500.00,
    ZAR: 12000.00,
    USD: 1000.00,
  });

  const connect = useCallback(async () => {
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAddress = '0x0b62e7acbfa9' + Math.random().toString(16).substring(2, 8);
      setAddress(mockAddress);
      setIsConnected(true);
      
      // Simulate fetching updated balances including native tokens
      setBalance({
        USDT: 1500.50 + Math.random() * 1000,
        NGN: 250000.00 + Math.random() * 100000,
        KES: 15000.00 + Math.random() * 5000,
        GHS: 8500.00 + Math.random() * 3000,
        ZAR: 12000.00 + Math.random() * 4000,
        USD: 1000.00 + Math.random() * 500,
      });
      
      toast({
        title: "Wallet Connected",
        description: `Connected to testnet wallet: ${mockAddress}`,
      });
      
      console.log(`Connected to testnet wallet: ${mockAddress}`);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setBalance({
      USDT: 0,
      NGN: 0,
      KES: 0,
      GHS: 0,
      ZAR: 0,
      USD: 0,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet",
    });
  }, []);

  return {
    isConnected,
    address,
    balance,
    network,
    connect,
    disconnect,
  };
};
