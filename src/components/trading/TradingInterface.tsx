
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import TradeModal from './TradeModal';
import { Pool } from '@/types/liquidity';
import { ArrowUpDown, TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';

interface TradingInterfaceProps {
  pool: Pool;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
  onTransactionComplete?: (transaction: any) => void;
}

const TradingInterface = ({ pool, onTrade, onTransactionComplete }: TradingInterfaceProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const { isConnected, connect, balance } = useWallet();
  const { toast } = useToast();

  const handleTradeClick = (type: 'buy' | 'sell') => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to start trading",
        variant: "destructive",
      });
      return;
    }
    
    setTradeType(type);
    setIsModalOpen(true);
  };

  const handleTradeComplete = (transaction: any) => {
    onTransactionComplete?.(transaction);
    onTrade(transaction.amount, transaction.type);
  };

  const rateChange = ((pool.exchangeRate - pool.previousRate) / pool.previousRate * 100);
  const isPositive = rateChange >= 0;

  return (
    <Card className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
          <ArrowUpDown className="w-5 h-5 mr-2 text-orange-400" />
          Trade USDT
        </h2>
        <Badge 
          variant="outline" 
          className={`${isPositive ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'} text-xs sm:text-sm`}
        >
          {isPositive ? '+' : ''}{rateChange.toFixed(2)}%
        </Badge>
      </div>

      {/* Exchange Rate Display */}
      <div className="mb-6 p-3 sm:p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Current Rate</span>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            )}
            <span className={`text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{rateChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white">
          1 USDT = {pool.exchangeRate.toLocaleString()} {pool.baseCurrency}
        </div>
        <div className="text-xs sm:text-sm text-gray-400 mt-1">
          Previous: {pool.previousRate.toLocaleString()} {pool.baseCurrency}
        </div>
      </div>

      {/* Wallet Status */}
      {isConnected ? (
        <div className="mb-6 p-3 sm:p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center">
              <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Your Balance
            </span>
            <span className="text-xs sm:text-sm text-orange-400">Connected</span>
          </div>
          <div className="text-lg sm:text-xl font-semibold text-white">
            {balance.USDT.toFixed(2)} USDT
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 sm:p-4 bg-white/5 rounded-lg text-center">
          <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-3">Connect wallet to start trading</p>
          <Button 
            onClick={connect}
            variant="outline"
            size="sm"
            className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
          >
            Connect Wallet
          </Button>
        </div>
      )}

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Button
          onClick={() => handleTradeClick('buy')}
          disabled={!isConnected}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4"
        >
          <div className="flex flex-col items-center space-y-1">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Buy USDT</span>
            <span className="text-xs opacity-80">Pay {pool.baseCurrency}</span>
          </div>
        </Button>
        
        <Button
          onClick={() => handleTradeClick('sell')}
          disabled={!isConnected}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4"
        >
          <div className="flex flex-col items-center space-y-1">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Sell USDT</span>
            <span className="text-xs opacity-80">Get {pool.baseCurrency}</span>
          </div>
        </Button>
      </div>

      {/* Trading Volume Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 text-center">
        <div className="p-2 sm:p-3 bg-white/5 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-400">24h Volume</p>
          <p className="text-sm sm:text-lg font-semibold text-white">
            ${pool.volume24h.toLocaleString()}
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-white/5 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-400">Total Liquidity</p>
          <p className="text-sm sm:text-lg font-semibold text-white">
            ${pool.totalLiquidity.toLocaleString()}
          </p>
        </div>
      </div>

      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tradeType={tradeType}
        baseCurrency={pool.baseCurrency}
        exchangeRate={pool.exchangeRate}
        userBalance={balance.USDT}
        onTradeComplete={handleTradeComplete}
      />
    </Card>
  );
};

export default TradingInterface;
