import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navigation/Navbar';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  Wallet,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const Contribute = () => {
  const [selectedPool, setSelectedPool] = useState('ngn-usdt');
  const [amount, setAmount] = useState('');
  const { isConnected, balance, connect } = useWallet();
  const { toast } = useToast();

  const pools = [
    {
      id: 'ngn-usdt',
      pair: 'NGN/USDT',
      apy: 24.5,
      rate: '1 NGN = 0.00087 USDT',
    },
    {
      id: 'ghs-usdt',
      pair: 'GHS/USDT',
      apy: 18.2,
      rate: '1 GHS = 0.08 USDT',
    },
    {
      id: 'kes-usdt',
      pair: 'KES/USDT',
      apy: 21.8,
      rate: '1 KES = 0.0077 USDT',
    },
  ];

  const handleContribute = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Your Wallet",
        description: "Please connect your wallet to contribute to liquidity pools. Use Hedera Testnet for testing.",
        variant: "destructive"
      });
      try {
        await connect();
        toast({
          title: "Wallet Connected!",
          description: "Perfect! You're now connected to Hedera Testnet. You can now contribute to liquidity pools.",
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
      return;
    }

    const contributionAmount = parseFloat(amount);
    if (!contributionAmount || contributionAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive"
      });
      return;
    }

    if (contributionAmount > balance.USDT) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${contributionAmount} USDT but only have ${balance.USDT} USDT. Get testnet funds to proceed.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Contribution Successful!",
      description: `Successfully contributed ${contributionAmount} USDT to ${selectedPool.replace('-', '/').toUpperCase()} pool.`,
    });
    
    console.log(`Contributing ${contributionAmount} USDT to ${selectedPool} pool`);
    setAmount('');
  };

  const selectedPoolData = pools.find(p => p.id === selectedPool);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Contribute to Liquidity
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Provide liquidity to earn passive income from trading fees. Connect your wallet and use Hedera Testnet for secure testing.
          </p>
        </div>

        {!isConnected && (
          <Card className="glass-card p-6 mb-8 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Wallet Not Connected</h3>
                  <p className="text-gray-300">Connect your wallet to start contributing to liquidity pools</p>
                </div>
              </div>
              <Button 
                onClick={connect}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Connect Wallet
              </Button>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pool Selection */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Available Pools</h2>
              <div className="grid gap-4">
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPool === pool.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pool.pair}</h3>
                        <p className="text-gray-300">{pool.rate}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Features Grid */}
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Maximize Your Earnings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">High APY</h3>
                    <p className="text-gray-300">Earn competitive annual percentage yields.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Passive Income</h3>
                    <p className="text-gray-300">Generate income from trading fees.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Growing Community</h3>
                    <p className="text-gray-300">Join a network of liquidity providers.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Real-Time Analytics</h3>
                    <p className="text-gray-300">Track your earnings and pool performance.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contribution Form */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Contribute Now</h3>
              
              {isConnected && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Wallet Connected</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Balance: {balance.USDT.toLocaleString()} USDT
                  </div>
                </div>
              )}

              {selectedPoolData && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Selected Pool</span>
                    <Badge className="bg-orange-500/20 text-orange-400">
                      {selectedPoolData.pair}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {selectedPoolData.apy}% APY
                  </div>
                  <div className="text-sm text-gray-300">
                    Current Rate: {selectedPoolData.rate}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (USDT)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to contribute"
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!isConnected}
                  />
                  {isConnected && balance.USDT > 0 && (
                    <div className="mt-2 flex space-x-2">
                      {[25, 50, 75, 100].map((percentage) => (
                        <Button
                          key={percentage}
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(((balance.USDT * percentage) / 100).toString())}
                          className="border-white/20 text-gray-300 hover:bg-white/10"
                        >
                          {percentage}%
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleContribute}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!isConnected || !amount}
                >
                  {!isConnected ? (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet to Contribute
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Contribute to Pool
                    </>
                  )}
                </Button>

                {!isConnected && (
                  <div className="text-xs text-gray-400 text-center">
                    Use Hedera Testnet for safe testing
                  </div>
                )}
              </div>
            </Card>

            {/* Portfolio Summary */}
            <Card className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Portfolio</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Invested</span>
                  <span className="text-white">0.00 USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Earnings</span>
                  <span className="text-white">0.00 USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Pools</span>
                  <span className="text-white">0</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5">
                  View Full Portfolio
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
