
import { useState } from 'react';
import { Pool } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { formatNumber } from '@/utils/liquidityCalculations';
import TradeModal from './TradeModal';

interface TradingInterfaceProps {
  pool: Pool;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
}

const TradingInterface = ({ pool, onTrade }: TradingInterfaceProps) => {
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [selectedTradeType, setSelectedTradeType] = useState<'buy' | 'sell'>('buy');
  
  const { isConnected, balance, connect, address } = useWallet();

  const handleTradeClick = (type: 'buy' | 'sell') => {
    if (!isConnected) {
      connect();
      return;
    }
    setSelectedTradeType(type);
    setTradeModalOpen(true);
  };

  if (!isConnected) {
    return (
      <Card className="glass-card p-6 sm:p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm sm:text-base">
              Connect your wallet to start trading {pool.baseCurrency} with verified merchants on our platform
            </p>
          </div>
          <Button 
            onClick={connect}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
          >
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Wallet Info */}
      <Card className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">Wallet Connected</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm">Active</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
            <div className="font-mono text-xs sm:text-sm text-white break-all">
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">USDT Balance</div>
              <div className="text-lg sm:text-xl font-bold text-white">{balance.USDT.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pool Information */}
      <Card className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-white">{pool.baseCurrency}/USDT Pool</h3>
          <div className="flex items-center space-x-2 text-sm">
            <ArrowLeftRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Live Rate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-white mb-1">
              {formatNumber(pool.exchangeRate)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Exchange Rate</div>
            <div className="text-xs text-green-400 mt-1">+2.4% (24h)</div>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              ${pool.volume24h.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">24h Volume</div>
          </div>
        </div>
      </Card>

      {/* Trading Actions */}
      <Card className="glass-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Quick Trade</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => handleTradeClick('buy')}
            size="lg"
            className="h-20 sm:h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group"
          >
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-sm sm:text-base">Buy USDT</div>
                <div className="text-xs sm:text-sm opacity-90">Pay with {pool.baseCurrency}</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleTradeClick('sell')}
            size="lg"
            className="h-20 sm:h-24 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white group"
          >
            <div className="flex flex-col items-center space-y-2">
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-sm sm:text-base">Sell USDT</div>
                <div className="text-xs sm:text-sm opacity-90">Receive {pool.baseCurrency}</div>
              </div>
            </div>
          </Button>
        </div>

        <div className="mt-4 sm:mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="text-sm">
              <p className="text-orange-300 font-medium mb-1">How P2P Trading Works</p>
              <p className="text-orange-200/80 leading-relaxed text-xs sm:text-sm">
                Our platform matches you with verified merchants. When you trade, you interact directly with them through secure escrow. 
                For buying USDT, transfer local currency to merchant's bank account. For selling USDT, provide your bank details to receive funds.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        tradeType={selectedTradeType}
        baseCurrency={pool.baseCurrency}
        exchangeRate={pool.exchangeRate}
        userBalance={balance.USDT}
      />
    </div>
  );
};

export default TradingInterface;
