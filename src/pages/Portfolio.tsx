import { useState, useEffect } from 'react';
import { LiquidityProvider, Transaction } from '@/types/liquidity';
import { mockLiquidityProviders, mockTransactions } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/liquidityCalculations';

const Portfolio = () => {
  const [provider, setProvider] = useState<LiquidityProvider | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    // Simulate user portfolio data
    const userProvider = mockLiquidityProviders[0];
    setProvider(userProvider);
    
    // Filter transactions for this provider
    const userTransactions = mockTransactions.slice(0, 10);
    setTransactions(userTransactions);
    
    // Calculate total earnings (simplified)
    const earnings = userTransactions.reduce((acc, tx) => acc + tx.fee, 0);
    setTotalEarnings(earnings);
  }, []);

  if (!provider) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Portfolio Found</h2>
            <p className="text-gray-300 mb-6">Connect your wallet to view your liquidity provider portfolio.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Liquidity Portfolio
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your liquidity contributions, earnings, and transaction history across all currency pools.
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 uppercase tracking-wide">Total Invested</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(provider.totalInvested, provider.currency)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 uppercase tracking-wide">Total Earnings</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(provider.totalEarnings, provider.currency)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300 uppercase tracking-wide">Pool Share</p>
                <p className="text-2xl font-bold text-white">
                  {provider.sharePercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Earnings</h2>
            <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg shadow-sm">
                    {transaction.type === 'buy' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {transaction.type === 'buy' ? 'Buy' : 'Sell'} {transaction.currency}
                    </p>
                    <p className="text-sm text-gray-300">
                      {transaction.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <p className="text-sm text-green-400">
                      +{formatCurrency(transaction.fee * 0.4, transaction.currency)} earned
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Add More Liquidity</h3>
            <p className="text-gray-300 mb-6">
              Increase your position in existing pools or join new currency pairs.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
              Contribute More
            </Button>
          </Card>

          <Card className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Withdraw Earnings</h3>
            <p className="text-gray-300 mb-6">
              Redeem your accumulated earnings from successful trades.
            </p>
            <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 w-full">
              Withdraw
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
