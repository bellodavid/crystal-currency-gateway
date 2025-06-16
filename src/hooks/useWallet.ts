
import { useState, useEffect } from 'react';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: {
    USDT: number;
    HBAR: number;
  };
  network: 'testnet' | 'mainnet';
}

export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToTestnet: () => Promise<void>;
}

export const useWallet = (): WalletState & WalletActions => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: {
      USDT: 0,
      HBAR: 0,
    },
    network: 'testnet',
  });

  // Simulate wallet connection for demo purposes
  const connect = async () => {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock testnet address
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      // Mock testnet balances
      setWallet({
        isConnected: true,
        address: mockAddress,
        balance: {
          USDT: 10000, // 10,000 USDT for testing
          HBAR: 500,   // 500 HBAR for testing
        },
        network: 'testnet',
      });

      console.log('Connected to testnet wallet:', mockAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: {
        USDT: 0,
        HBAR: 0,
      },
      network: 'testnet',
    });
    console.log('Wallet disconnected');
  };

  const switchToTestnet = async () => {
    if (wallet.isConnected) {
      setWallet(prev => ({
        ...prev,
        network: 'testnet',
      }));
      console.log('Switched to testnet');
    }
  };

  // Update balance periodically (simulate real-time updates)
  useEffect(() => {
    if (wallet.isConnected) {
      const interval = setInterval(() => {
        setWallet(prev => ({
          ...prev,
          balance: {
            ...prev.balance,
            // Add small random fluctuations for demo
            HBAR: prev.balance.HBAR + (Math.random() - 0.5) * 10,
          },
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [wallet.isConnected]);

  return {
    ...wallet,
    connect,
    disconnect,
    switchToTestnet,
  };
};
