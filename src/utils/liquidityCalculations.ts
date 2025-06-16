
import { Pool, DynamicFeeCalculation } from '@/types/liquidity';

export const calculateDynamicFee = (
  currentRate: number,
  previousRate: number,
  currentPool: number,
  targetPool: number,
  baseFee: number = 2
): DynamicFeeCalculation => {
  // A. Exchange Rate Volatility Component
  const rateChangePercentage = Math.abs((currentRate - previousRate) / previousRate) * 100;
  const volatilityFee = (rateChangePercentage / 10) * 0.5;

  // B. Pool Health Component
  const poolImbalance = Math.abs(currentPool - targetPool) / targetPool * 100;
  let poolHealthFee = 0;
  
  if (poolImbalance > 40) {
    poolHealthFee = 2;
  } else if (poolImbalance > 20) {
    poolHealthFee = 1;
  }

  // C. Total Dynamic Fee (with cap)
  const totalFee = Math.min(baseFee + volatilityFee + poolHealthFee, 8);

  return {
    baseFee,
    volatilityFee,
    poolHealthFee,
    totalFee,
    rateChangePercentage,
    poolImbalance
  };
};

export const calculateTradeAmount = (
  usdtAmount: number,
  exchangeRate: number,
  fee: number,
  isSellingUSDT: boolean
): { localAmount: number; feeAmount: number; netAmount: number } => {
  const baseLocalAmount = usdtAmount * exchangeRate;
  const feeAmount = baseLocalAmount * (fee / 100);
  
  if (isSellingUSDT) {
    // User sells USDT, receives local currency minus fee
    const netAmount = baseLocalAmount - feeAmount;
    return { localAmount: baseLocalAmount, feeAmount, netAmount };
  } else {
    // User buys USDT, pays local currency plus fee
    const netAmount = baseLocalAmount + feeAmount;
    return { localAmount: baseLocalAmount, feeAmount, netAmount };
  }
};

export const updatePoolAfterTrade = (
  pool: Pool,
  usdtAmount: number,
  localAmount: number,
  isSellingUSDT: boolean
): Pool => {
  if (isSellingUSDT) {
    return {
      ...pool,
      baseAmount: pool.baseAmount - localAmount,
      quoteAmount: pool.quoteAmount + usdtAmount,
    };
  } else {
    return {
      ...pool,
      baseAmount: pool.baseAmount + localAmount,
      quoteAmount: pool.quoteAmount - usdtAmount,
    };
  }
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'NGN' ? 'NGN' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
