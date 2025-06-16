
import { useState, useEffect } from 'react';
import { Pool, DynamicFeeCalculation } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, Info, AlertTriangle } from 'lucide-react';
import { calculateDynamicFee, calculateTradeAmount, formatCurrency, formatNumber } from '@/utils/liquidityCalculations';
import FeeBreakdown from './FeeBreakdown';

interface TradingInterfaceProps {
  pool: Pool;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
}

const TradingInterface = ({ pool, onTrade }: TradingInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('sell');
  const [amount, setAmount] = useState('');
  const [feeCalculation, setFeeCalculation] = useState<DynamicFeeCalculation | null>(null);
  const [tradeCalculation, setTradeCalculation] = useState<any>(null);

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
  }, [amount, activeTab, pool]);

  const handleTrade = () => {
    if (amount && parseFloat(amount) > 0) {
      onTrade(parseFloat(amount), activeTab);
      setAmount('');
    }
  };

  const isHighFee = feeCalculation && feeCalculation.totalFee > 5;

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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger 
              value="sell" 
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              Sell USDT
            </TabsTrigger>
            <TabsTrigger 
              value="buy"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Buy USDT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount to Sell (USDT)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount to Buy (USDT)</label>
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
                  <span className="text-gray-400">
                    {activeTab === 'sell' ? 'You will receive' : 'You will pay'}:
                  </span>
                  <span className="text-white font-medium">
                    {formatCurrency(tradeCalculation.netAmount, pool.baseCurrency)}
                  </span>
                </div>
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
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full font-semibold ${
            activeTab === 'sell' 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          } text-white`}
        >
          {activeTab === 'sell' ? 'Sell USDT' : 'Buy USDT'}
        </Button>

        <div className="flex items-start space-x-2 text-xs text-gray-400">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Trades are processed by verified liquidity merchants. 
            Dynamic fees adjust based on market volatility and pool health to ensure sustainable liquidity.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TradingInterface;
