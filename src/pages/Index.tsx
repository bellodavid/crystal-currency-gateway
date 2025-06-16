
import { useState, useEffect } from 'react';
import { Pool } from '@/types/liquidity';
import { mockPools, getUpdatedExchangeRate } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import PoolSelector from '@/components/pool/PoolSelector';
import PoolStats from '@/components/pool/PoolStats';
import TradingInterface from '@/components/trading/TradingInterface';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    // Simulate trade processing
    toast({
      title: "Trade Initiated",
      description: `${type === 'buy' ? 'Buying' : 'Selling'} ${amount} USDT. Connecting to merchant...`,
      duration: 3000,
    });

    // Simulate trade completion after 3 seconds
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
      color: 'text-orange-500',
    },
    {
      label: 'Active Merchants',
      value: '247',
      change: '+8',
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: '24h Volume',
      value: '$890K',
      change: '+24.8%',
      icon: Activity,
      color: 'text-purple-500',
    },
    {
      label: 'Avg APY',
      value: '19.2%',
      change: '+1.4%',
      icon: Zap,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              Currency Liquidity Pool
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Trade seamlessly between local currencies and USDT with our automated market maker. 
            Powered by verified merchants across 150+ countries.
          </p>
          
          {/* Global Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {globalStats.map((stat, index) => (
              <Card key={index} className="glass-card p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-gray-300">{stat.label}</span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-green-400">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Pool Selection & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <PoolSelector 
              pools={pools}
              selectedPool={selectedPool}
              onPoolSelect={setSelectedPool}
            />
            
            <PoolStats pool={selectedPool} />
            
            {/* Pool Composition */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pool Composition</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {selectedPool.baseCurrency.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{selectedPool.baseCurrency}</p>
                      <p className="text-sm text-gray-300">Base Currency</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {selectedPool.baseAmount.toLocaleString()} {selectedPool.baseCurrency}
                    </p>
                    <p className="text-sm text-gray-300">
                      {((selectedPool.baseAmount / selectedPool.exchangeRate) / selectedPool.totalLiquidity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      UT
                    </div>
                    <div>
                      <p className="font-medium text-white">USDT</p>
                      <p className="text-sm text-gray-300">Quote Currency</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {selectedPool.quoteAmount.toLocaleString()} USDT
                    </p>
                    <p className="text-sm text-gray-300">
                      {(selectedPool.quoteAmount / selectedPool.totalLiquidity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Trading Interface */}
          <div className="space-y-6">
            <TradingInterface 
              pool={selectedPool}
              onTrade={handleTrade}
            />
            
            {/* Quick Info */}
            <Card className="glass-card p-4">
              <h4 className="font-medium text-white mb-3">How it works</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-xs font-bold">1</span>
                  </div>
                  <p>Enter trade amount and review dynamic fees</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-xs font-bold">2</span>
                  </div>
                  <p>Connect wallet and confirm transaction</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-xs font-bold">3</span>
                  </div>
                  <p>Verified merchant processes your trade</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-xs font-bold">4</span>
                  </div>
                  <p>Receive funds in your wallet or bank account</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
