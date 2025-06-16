
import { useState } from 'react';
import { LiquidityProvider } from '@/types/liquidity';
import { mockLiquidityProviders } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/liquidityCalculations';
import { toast } from '@/hooks/use-toast';

const Portfolio = () => {
  const [selectedProvider] = useState<LiquidityProvider>(mockLiquidityProviders[0]);

  const mockTransactions = [
    {
      id: 'tx-1',
      type: 'add_liquidity',
      amount: 5000,
      currency: 'USDT',
      pool: 'NGN/USDT',
      fee: 125.50,
      timestamp: new Date('2024-06-15T10:30:00'),
      status: 'completed'
    },
    {
      id: 'tx-2',
      type: 'earn_fee',
      amount: 45.20,
      currency: 'USDT',
      pool: 'NGN/USDT',
      fee: 0,
      timestamp: new Date('2024-06-14T15:45:00'),
      status: 'completed'
    },
    {
      id: 'tx-3',
      type: 'earn_fee',
      amount: 32.80,
      currency: 'USDT',
      pool: 'NGN/USDT',
      fee: 0,
      timestamp: new Date('2024-06-13T09:20:00'),
      status: 'completed'
    },
    {
      id: 'tx-4',
      type: 'add_liquidity',
      amount: 10000,
      currency: 'USDT',
      pool: 'NGN/USDT',
      fee: 251.00,
      timestamp: new Date('2024-06-12T14:15:00'),
      status: 'completed'
    },
  ];

  const handleRedeem = (amount: string) => {
    toast({
      title: "Redemption Initiated",
      description: `Redeeming ${amount} USDT. Processing will take 24-48 hours.`,
    });
  };

  const totalValue = selectedProvider.totalInvested + selectedProvider.totalEarnings;
  const totalReturn = (selectedProvider.totalEarnings / selectedProvider.totalInvested) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-crystal-400 via-gold-400 to-crystal-400 bg-clip-text text-transparent">
              My Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Track your liquidity contributions and earnings across all pools.
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-crystal-500/10 rounded-lg">
                <Wallet className="w-6 h-6 text-crystal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Invested</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(selectedProvider.totalInvested, 'USD')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(selectedProvider.totalEarnings, 'USD')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gold-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(totalValue, 'USD')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Return</p>
                <p className="text-2xl font-bold text-purple-400">
                  +{totalReturn.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Position Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Positions */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Active Positions</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-8 h-8 bg-gradient-to-r from-crystal-400 to-crystal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          NG
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          UT
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">NGN/USDT Pool</h3>
                        <p className="text-sm text-gray-400">{selectedProvider.sharePercentage}% of pool</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(selectedProvider.totalInvested, 'USD')}
                      </p>
                      <p className="text-sm text-green-400">
                        +{formatCurrency(selectedProvider.totalEarnings, 'USD')} earned
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400">Daily Earnings</p>
                      <p className="text-sm font-medium text-white">$12.45</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">APY</p>
                      <p className="text-sm font-medium text-green-400">24.5%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Since</p>
                      <p className="text-sm font-medium text-white">
                        {selectedProvider.joinDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Transaction History */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Transaction History</h2>
              
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'add_liquidity' 
                          ? 'bg-blue-500/10' 
                          : 'bg-green-500/10'
                      }`}>
                        {tx.type === 'add_liquidity' ? (
                          <ArrowDownLeft className={`w-4 h-4 ${
                            tx.type === 'add_liquidity' ? 'text-blue-400' : 'text-green-400'
                          }`} />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-white">
                          {tx.type === 'add_liquidity' ? 'Added Liquidity' : 'Fee Earned'}
                        </p>
                        <p className="text-sm text-gray-400">{tx.pool}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-medium ${
                        tx.type === 'add_liquidity' ? 'text-white' : 'text-green-400'
                      }`}>
                        {tx.type === 'add_liquidity' ? '' : '+'}{formatCurrency(tx.amount, 'USD')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {tx.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button className="w-full bg-crystal-gradient hover:opacity-90 text-white">
                  Add More Liquidity
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => handleRedeem('1000')}
                >
                  Redeem Earnings
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleRedeem('all')}
                >
                  Withdraw All
                </Button>
              </div>
            </Card>

            {/* Earnings Breakdown */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Earnings Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Trading Fees</span>
                  <span className="text-green-400 font-medium">$2,234.50</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Merchant Bonuses</span>
                  <span className="text-green-400 font-medium">$512.30</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pool Incentives</span>
                  <span className="text-green-400 font-medium">$101.00</span>
                </div>
                
                <hr className="border-white/10" />
                
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-white">Total Earnings</span>
                  <span className="text-green-400">{formatCurrency(selectedProvider.totalEarnings, 'USD')}</span>
                </div>
              </div>
            </Card>

            {/* Redemption Info */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Redemption Policy</h3>
              
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Standard processing: 24-48 hours</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Large withdrawals (>$10k): 3-5 business days</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Redemption fee: 0.2% (reduced for long-term LPs)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
