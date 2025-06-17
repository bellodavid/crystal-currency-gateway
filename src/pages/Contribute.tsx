
import { useState } from 'react';
import { Pool } from '@/types/liquidity';
import { mockPools } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Shield,
  ArrowRight,
  Info,
  PiggyBank
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/liquidityCalculations';
import { toast } from '@/hooks/use-toast';

const Contribute = () => {
  const [selectedPool, setSelectedPool] = useState<Pool>(mockPools[0]);
  const [contributeAmount, setContributeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'usdt' | 'local'>('usdt');

  const handleContribute = () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Contribution Initiated",
      description: `Contributing ${contributeAmount} ${activeTab === 'usdt' ? 'USDT' : selectedPool.baseCurrency} to ${selectedPool.baseCurrency}/USDT pool...`,
    });

    // Simulate contribution processing
    setTimeout(() => {
      toast({
        title: "Contribution Successful!",
        description: `Successfully added ${contributeAmount} ${activeTab === 'usdt' ? 'USDT' : selectedPool.baseCurrency} to the liquidity pool.`,
      });
      setContributeAmount('');
    }, 2000);
  };

  const estimatedShares = contributeAmount ? 
    (parseFloat(contributeAmount) / selectedPool.totalLiquidity * 100).toFixed(4) : '0';

  const estimatedEarnings = contributeAmount ? 
    (parseFloat(contributeAmount) * selectedPool.apy / 100 / 365).toFixed(2) : '0';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Contribute Liquidity
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Provide liquidity to currency pools and earn fees from every trade. 
            Your contribution helps traders access seamless fiat onramp/offramp services.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Pool Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pool Selection */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Select Pool</h2>
              <div className="grid gap-4">
                {mockPools.map((pool) => (
                  <div
                    key={pool.id}
                    onClick={() => setSelectedPool(pool)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedPool.id === pool.id
                        ? 'border-orange-400 bg-orange-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {pool.baseCurrency.slice(0, 2)}
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            UT
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{pool.baseCurrency}/USDT</h3>
                          <p className="text-sm text-gray-400">
                            TVL: {formatCurrency(pool.totalLiquidity, 'USD')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-400">
                          {pool.apy.toFixed(1)}% APY
                        </div>
                        <p className="text-sm text-gray-400">
                          24h Vol: {formatCurrency(pool.volume24h, pool.baseCurrency)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pool Details */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {selectedPool.baseCurrency}/USDT Pool Details
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Pool Balance ({selectedPool.baseCurrency})</span>
                    <span className="text-white font-medium">
                      {formatCurrency(selectedPool.baseAmount, selectedPool.baseCurrency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Pool Balance (USDT)</span>
                    <span className="text-white font-medium">
                      {formatCurrency(selectedPool.quoteAmount, 'USD')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span className="text-white font-medium">
                      {formatNumber(selectedPool.exchangeRate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">24h Fees Earned</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(selectedPool.fees24h, selectedPool.baseCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* How It Works */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How Liquidity Provision Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Provide Liquidity</h4>
                    <p className="text-sm text-gray-400">
                      Add USDT or local currency to the pool and receive LP tokens representing your share.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Earn Trading Fees</h4>
                    <p className="text-sm text-gray-400">
                      Collect a share of all trading fees generated by the pool based on your contribution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Withdraw Anytime</h4>
                    <p className="text-sm text-gray-400">
                      Remove your liquidity at any time (subject to 3-day processing period for large amounts).
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Contribution Interface */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add Liquidity</h3>
              
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'usdt' | 'local')}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="usdt" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                    USDT
                  </TabsTrigger>
                  <TabsTrigger value="local" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                    {selectedPool.baseCurrency}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="usdt" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Amount (USDT)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="local" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Amount ({selectedPool.baseCurrency})</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Contribution Summary */}
              {contributeAmount && parseFloat(contributeAmount) > 0 && (
                <div className="glass-card p-4 space-y-3">
                  <h4 className="font-medium text-white">Contribution Summary</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">You will receive:</span>
                      <span className="text-white font-medium">{estimatedShares}% of pool</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. daily earnings:</span>
                      <span className="text-green-400 font-medium">
                        ${estimatedEarnings}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current APY:</span>
                      <span className="text-purple-400 font-medium">{selectedPool.apy.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleContribute}
                disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold"
              >
                Add Liquidity
              </Button>

              <div className="flex items-start space-x-2 text-xs text-gray-400">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Liquidity contributions are subject to smart contract risks and market volatility. 
                  Please understand the risks before contributing.
                </p>
              </div>
            </Card>

            {/* Benefits */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Liquidity Provider Benefits</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">High Yields</p>
                    <p className="text-xs text-gray-400">Earn competitive APY from trading fees</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Multiple Currencies</p>
                    <p className="text-xs text-gray-400">Diversify across 150+ fiat currencies</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Instant Rewards</p>
                    <p className="text-xs text-gray-400">Earn fees from every trade immediately</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Shield className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Verified Merchants</p>
                    <p className="text-xs text-gray-400">All trades processed by KYC-verified partners</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
