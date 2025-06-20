import { Pool, Merchant, LiquidityProvider, Transaction } from '@/types/liquidity';

export const mockPools: Pool[] = [
  {
    id: 'ngn-usdt',
    baseCurrency: 'NGN',
    quoteCurrency: 'USDT',
    baseAmount: 5000000,
    quoteAmount: 50000,
    exchangeRate: 1150,
    previousRate: 1000,
    totalLiquidity: 107500,
    apy: 24.5,
    volume24h: 2500000,
    fees24h: 15000,
  },
  {
    id: 'ghs-usdt',
    baseCurrency: 'GHS',
    quoteCurrency: 'USDT',
    baseAmount: 750000,
    quoteAmount: 62500,
    exchangeRate: 12.5,
    previousRate: 12.0,
    totalLiquidity: 125000,
    apy: 18.2,
    volume24h: 890000,
    fees24h: 8500,
  },
  {
    id: 'kes-usdt',
    baseCurrency: 'KES',
    quoteCurrency: 'USDT',
    baseAmount: 8500000,
    quoteAmount: 65000,
    exchangeRate: 130,
    previousRate: 128,
    totalLiquidity: 130000,
    apy: 21.8,
    volume24h: 1200000,
    fees24h: 12000,
  },
  {
    id: 'eur-usdt',
    baseCurrency: 'EUR',
    quoteCurrency: 'USDT',
    baseAmount: 95000,
    quoteAmount: 100000,
    exchangeRate: 0.95,
    previousRate: 0.94,
    totalLiquidity: 195000,
    apy: 12.5,
    volume24h: 5200000,
    fees24h: 25000,
  },
];

export const mockMerchants: Merchant[] = [
  {
    id: 'merchant-1',
    name: 'Lagos Financial Services',
    country: 'Nigeria',
    currency: 'NGN',
    availableBalance: 420000,
    bookBalance: 1000000,
    performanceScore: 96.5,
    completionRate: 98.2,
    averageProcessingTime: 3.5,
    isOnline: true,
    totalTransactions: 1247,
  },
  {
    id: 'merchant-2',
    name: 'Abuja Crypto Exchange',
    country: 'Nigeria',
    currency: 'NGN',
    availableBalance: 616000,
    bookBalance: 804000,
    performanceScore: 94.2,
    completionRate: 96.8,
    averageProcessingTime: 4.2,
    isOnline: true,
    totalTransactions: 892,
  },
  {
    id: 'merchant-3',
    name: 'Accra Digital Bank',
    country: 'Ghana',
    currency: 'GHS',
    availableBalance: 85000,
    bookBalance: 150000,
    performanceScore: 92.8,
    completionRate: 95.5,
    averageProcessingTime: 5.1,
    isOnline: true,
    totalTransactions: 634,
  },
  {
    id: 'merchant-4',
    name: 'Nairobi Fintech Hub',
    country: 'Kenya',
    currency: 'KES',
    availableBalance: 520000,
    bookBalance: 800000,
    performanceScore: 98.1,
    completionRate: 99.1,
    averageProcessingTime: 2.8,
    isOnline: false,
    totalTransactions: 1856,
  },
];

export const mockLiquidityProviders: LiquidityProvider[] = [
  {
    id: 'lp-1',
    address: '0x742d35Cc6634C0532925a3b8D433C4C8d8C0C4c8',
    totalInvested: 25000,
    currency: 'USDT',
    totalEarnings: 2847.5,
    sharePercentage: 23.5,
    joinDate: new Date('2024-01-15'),
  },
  {
    id: 'lp-2',
    address: '0x8ba1f109551bD432803012645Hh79a49e5e4a8',
    totalInvested: 15000,
    currency: 'USDT',
    totalEarnings: 1654.2,
    sharePercentage: 14.1,
    joinDate: new Date('2024-02-22'),
  },
  {
    id: 'lp-3',
    address: '0x123def456789abc123def456789abc123def4567',
    totalInvested: 50000,
    currency: 'USDT',
    totalEarnings: 5234.8,
    sharePercentage: 47.0,
    joinDate: new Date('2023-12-08'),
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'sell',
    amount: 200,
    currency: 'USDT',
    exchangeRate: 1150,
    fee: 4600,
    merchantId: 'merchant-1',
    status: 'completed',
    timestamp: new Date('2024-06-15T10:30:00'),
    userId: 'user-1',
  },
  {
    id: 'tx-2',
    type: 'buy',
    amount: 500,
    currency: 'USDT',
    exchangeRate: 1150,
    fee: 15812.5,
    merchantId: 'merchant-2',
    status: 'completed',
    timestamp: new Date('2024-06-14T14:20:00'),
    userId: 'user-1',
  },
  {
    id: 'tx-3',
    type: 'sell',
    amount: 100,
    currency: 'USDT',
    exchangeRate: 1140,
    fee: 2280,
    merchantId: 'merchant-1',
    status: 'pending',
    timestamp: new Date('2024-06-13T09:15:00'),
    userId: 'user-1',
  },
  {
    id: 'tx-4',
    type: 'buy',
    amount: 750,
    currency: 'USDT',
    exchangeRate: 1160,
    fee: 23200,
    merchantId: 'merchant-3',
    status: 'completed',
    timestamp: new Date('2024-06-12T16:45:00'),
    userId: 'user-1',
  },
  {
    id: 'tx-5',
    type: 'sell',
    amount: 300,
    currency: 'USDT',
    exchangeRate: 1130,
    fee: 6780,
    merchantId: 'merchant-2',
    status: 'failed',
    timestamp: new Date('2024-06-11T11:30:00'),
    userId: 'user-1',
  },
];

// Simulate exchange rate fluctuations
export const getUpdatedExchangeRate = (baseRate: number, volatility: number = 0.05): number => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return baseRate * (1 + change);
};

// Simulate merchant performance updates
export const updateMerchantPerformance = (merchant: Merchant): Merchant => {
  const performanceChange = (Math.random() - 0.5) * 2;
  return {
    ...merchant,
    performanceScore: Math.max(80, Math.min(100, merchant.performanceScore + performanceChange)),
    isOnline: Math.random() > 0.1, // 90% chance of being online
  };
};
