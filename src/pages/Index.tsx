
import { useState, useEffect } from 'react';
import { Pool } from '@/types/liquidity';
import { mockPools, getUpdatedExchangeRate } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import PoolSelector from '@/components/pool/PoolSelector';
import PoolStats from '@/components/pool/PoolStats';
import TradingInterface from '@/components/trading/TradingInterface';
import TransactionHistory from '@/components/trading/TransactionHistory';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Activity, DollarSign, Users, Zap } from 'lucide-react';

const Index = () => {
  const [pools, setPools] = useState<Pool[]>(mockPools);
  const [selectedPool, setSelectedPool] = useState<Pool>(mockPools[0]);

  // Update selected pool when pools change
  useEffect(() => {
    const updatedPool = pools.find(p => p.id === selectedPool.id);
    if (updatedPool) {
      setSelectedPool(updatedPool);
    }
  }, [pools, selectedPool.id]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPools(currentPools => 
        currentPools.map(pool => ({
          ...pool,
          previousRate: pool.exchangeRate,
          exchangeRate: getUpdatedExchangeRate(pool.exchangeRate, 0.02),
          volume24h: pool.volume24h + Math.random() * 10000,
          fees24h: pool.fees24h + Math.random() * 100,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTrade = (amount: number, type: 'buy' | 'sell') => {
    toast({
      title: "Trade Initiated",
      description: `${type === 'buy' ? 'Buying' : 'Selling'} ${amount} USDT. Matching with merchant...`,
      duration: 3000,
    });

    setTimeout(() => {
      toast({
        title: "Trade Completed",
        description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} USDT!`,
        duration: 5000,
      });
    }, 3000);
  };

  const globalStats = [
    {
      label: 'Total Value Locked',
      value: '$2.4M',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-orange-400',
    },
    {
      label: 'Active Merchants',
      value: '247',
      change: '+8',
      icon: Users,
      color: 'text-green-400',
    },
    {
      label: '24h Volume',
      value: '$890K',
      change: '+24.8%',
      icon: Activity,
      color: 'text-purple-400',
    },
    {
      label: 'Avg APY',
      value: '19.2%',
      change: '+1.4%',
      icon: Zap,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-white">
            Currency Liquidity Pool
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Trade seamlessly between local currencies and USDT with our automated market maker. 
            Powered by verified merchants across 150+ countries.
          </p>
          
          {/* Global Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {globalStats.map((stat, index) => (
              <Card key={index} className="glass-card p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                  <span className="text-xs sm:text-sm text-gray-300 text-center">{stat.label}</span>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-green-400">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Left Column - Pool Selection & Stats */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <PoolSelector 
              pools={pools}
              selectedPool={selectedPool}
              onPoolSelect={setSelectedPool}
            />
            
            <PoolStats pool={selectedPool} />
            
            {/* Pool Composition */}
            <Card className="glass-card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Pool Composition</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {selectedPool.baseCurrency.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">{selectedPool.baseCurrency}</p>
                      <p className="text-xs sm:text-sm text-gray-300">Base Currency</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white text-sm sm:text-base">
                      {selectedPool.baseAmount.toLocaleString()} {selectedPool.baseCurrency}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {((selectedPool.baseAmount / selectedPool.exchangeRate) / selectedPool.totalLiquidity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      UT
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">USDT</p>
                      <p className="text-xs sm:text-sm text-gray-300">Quote Currency</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white text-sm sm:text-base">
                      {selectedPool.quoteAmount.toLocaleString()} USDT
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {(selectedPool.quoteAmount / selectedPool.totalLiquidity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Columns - Trading Interface & History */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <TradingInterface 
              pool={selectedPool}
              onTrade={handleTrade}
            />
            
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
