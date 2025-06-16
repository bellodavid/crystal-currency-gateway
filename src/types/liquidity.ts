
export interface Pool {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  baseAmount: number;
  quoteAmount: number;
  exchangeRate: number;
  previousRate: number;
  totalLiquidity: number;
  apy: number;
  volume24h: number;
  fees24h: number;
}

export interface Merchant {
  id: string;
  name: string;
  country: string;
  currency: string;
  availableBalance: number;
  bookBalance: number;
  performanceScore: number;
  completionRate: number;
  averageProcessingTime: number;
  isOnline: boolean;
  totalTransactions: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  currency: string;
  exchangeRate: number;
  fee: number;
  merchantId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'disputed';
  timestamp: Date;
  userId: string;
}

export interface DynamicFeeCalculation {
  baseFee: number;
  volatilityFee: number;
  poolHealthFee: number;
  totalFee: number;
  rateChangePercentage: number;
  poolImbalance: number;
}

export interface LiquidityProvider {
  id: string;
  address: string;
  totalInvested: number;
  currency: string;
  totalEarnings: number;
  sharePercentage: number;
  joinDate: Date;
}
