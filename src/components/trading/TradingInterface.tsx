
import { useState, useEffect } from 'react';
import { Pool, DynamicFeeCalculation } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown, Info, AlertTriangle, Wallet, ArrowLeftRight } from 'lucide-react';
import { calculateDynamicFee, calculateTradeAmount, formatCurrency, formatNumber } from '@/utils/liquidityCalculations';
import FeeBreakdown from './FeeBreakdown';

interface TradingInterfaceProps {
  pool: Pool;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
}

const TradingInterface = ({ pool, onTrade }: TradingInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('sell');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USDT' | 'native'>('USDT');
  const [feeCalculation, setFeeCalculation] = useState<DynamicFeeCalculation | null>(null);
  const [tradeCalculation, setTradeCalculation] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { isConnected, balance, connect } = useWallet();
  const { toast } = useToast();

  // Native token symbol based on pool
  const nativeTokenSymbol = pool.baseCurrency === 'NGN' ? 'NGNT' : 
                           pool.baseCurrency === 'KES' ? 'KEST' :
                           pool.baseCurrency === 'GHS' ? 'GHST' :
                           pool.baseCurrency === 'ZAR' ? 'ZART' :
                           pool.baseCurrency === 'USD' ? 'USDT' :
                           `${pool.baseCurrency}T`;

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const feeCalc = calculateDynamicFee(
        pool.exchangeRate,
        pool.previousRate,
        pool.baseAmount,
        5000000 // target pool amount
      );
      setFeeCalculation(feeCalc);

      const tradeCalc = calculateTradeAmount(
        parseFloat(amount),
        pool.exchangeRate,
        feeCalc.totalFee,
        activeTab === 'sell'
      );
      setTradeCalculation(tradeCalc);
    } else {
      setFeeCalculation(null);
      setTradeCalculation(null);
    }
  }, [amount, activeTab, pool, selectedCurrency]);

  const handleTrade = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const tradeAmount = parseFloat(amount);

    // Check if user has sufficient balance based on selected currency
    const requiredBalance = selectedCurrency === 'USDT' ? balance.USDT : balance[pool.baseCurrency] || 0;
    if (activeTab === 'sell' && tradeAmount > requiredBalance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${requiredBalance} ${selectedCurrency === 'USDT' ? 'USDT' : nativeTokenSymbol} available`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onTrade(tradeAmount, activeTab);
      
      const currencySymbol = selectedCurrency === 'USDT' ? 'USDT' : nativeTokenSymbol;
      toast({
        title: "Transaction initiated",
        description: `Your ${activeTab} order for ${tradeAmount} ${currencySymbol} has been submitted`,
      });
      
      setAmount('');
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isHighFee = feeCalculation && feeCalculation.totalFee > 5;
  const currentBalance = selectedCurrency === 'USDT' ? balance.USDT : (balance[pool.baseCurrency] || 0);
  const maxAmount = activeTab === 'sell' ? currentBalance : 999999;
  const displayCurrency = selectedCurrency === 'USDT' ? 'USDT' : nativeTokenSymbol;

  if (!isConnected) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center space-y-4">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Connect Your Wallet</h3>
          <p className="text-gray-400">
            Connect your wallet to start trading {pool.baseCurrency} with our liquidity pool
          </p>
          <Button 
            onClick={connect}
            className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white"
          >
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Trade {pool.baseCurrency}</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Exchange Rate:</span>
            <span className="text-white font-medium">{formatNumber(pool.exchangeRate)}</span>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="space-y-3">
          <label className="text-sm text-gray-400">Select Currency</label>
          <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as 'USDT' | 'native')}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              <SelectItem value="USDT" className="text-white hover:bg-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">$</div>
                  <span>USDT (Tether)</span>
                </div>
              </SelectItem>
              <SelectItem value="native" className="text-white hover:bg-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {pool.baseCurrency.slice(0, 1)}
                  </div>
                  <span>{nativeTokenSymbol} ({pool.baseCurrency} Token)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wallet Balance Display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-lg">
            <span className="text-xs text-gray-400">USDT Balance</span>
            <div className="text-white font-medium">{balance.USDT.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <span className="text-xs text-gray-400">{nativeTokenSymbol} Balance</span>
            <div className="text-white font-medium">{(balance[pool.baseCurrency] || 0).toLocaleString()}</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger 
              value="sell" 
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              Sell {displayCurrency}
            </TabsTrigger>
            <TabsTrigger 
              value="buy"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Buy {displayCurrency}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Amount to Sell ({displayCurrency})</label>
                <button
                  onClick={() => setAmount(currentBalance.toString())}
                  className="text-xs text-orange-400 hover:text-orange-300"
                >
                  Max: {currentBalance.toLocaleString()}
                </button>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={maxAmount}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount to Buy ({displayCurrency})</label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Conversion Preview */}
        {amount && parseFloat(amount) > 0 && (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-sm text-gray-400">You {activeTab}</div>
                <div className="text-white font-medium">{amount} {displayCurrency}</div>
              </div>
              <ArrowLeftRight className="w-4 h-4 text-gray-400" />
              <div className="text-center">
                <div className="text-sm text-gray-400">You get</div>
                <div className="text-white font-medium">
                  {tradeCalculation ? formatNumber(tradeCalculation.netAmount) : '0'} {selectedCurrency === 'USDT' ? nativeTokenSymbol : 'USDT'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trade Summary */}
        {tradeCalculation && feeCalculation && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Trade Summary</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Exchange Rate:</span>
                  <span className="text-white">{formatNumber(pool.exchangeRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dynamic Fee:</span>
                  <span className={`font-medium ${isHighFee ? 'text-red-400' : 'text-gray-300'}`}>
                    {feeCalculation.totalFee.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-gray-300">~0.001 HBAR</span>
                </div>
              </div>

              {isHighFee && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-300">
                    <p className="font-medium">High volatility detected</p>
                    <p>Fees are elevated due to market conditions and pool health.</p>
                  </div>
                </div>
              )}
            </div>

            <FeeBreakdown feeCalculation={feeCalculation} />
          </div>
        )}

        <Button 
          onClick={handleTrade}
          disabled={!amount || parseFloat(amount) <= 0 || isProcessing || parseFloat(amount) > maxAmount}
          className={`w-full font-semibold ${
            activeTab === 'sell' 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          } text-white disabled:opacity-50`}
        >
          {isProcessing ? (
            'Processing...'
          ) : (
            `${activeTab === 'sell' ? 'Sell' : 'Buy'} ${displayCurrency}`
          )}
        </Button>

        <div className="flex items-start space-x-2 text-xs text-gray-400">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Trades are processed by verified liquidity merchants on Hedera testnet. 
            You can trade between USDT and native tokens ({nativeTokenSymbol}) seamlessly.
            Dynamic fees adjust based on market volatility and pool health.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TradingInterface;
