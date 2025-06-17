import { useState, useEffect } from 'react';
import { Merchant } from '@/types/liquidity';
import { mockMerchants, updateMerchantPerformance } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import MerchantCard from '@/components/merchants/MerchantCard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Wallet
} from 'lucide-react';

const Merchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { isConnected, connect } = useWallet();
  const { toast } = useToast();

  // Update merchant performance periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMerchants(currentMerchants => 
        currentMerchants.map(updateMerchantPerformance)
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || merchant.country === selectedCountry;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'online' && merchant.isOnline) ||
                         (statusFilter === 'offline' && !merchant.isOnline);
    
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const countries = [...new Set(merchants.map(m => m.country))];
  const onlineMerchants = merchants.filter(m => m.isOnline).length;
  const avgPerformance = merchants.reduce((acc, m) => acc + m.performanceScore, 0) / merchants.length;
  const totalTransactions = merchants.reduce((acc, m) => acc + m.totalTransactions, 0);

  const handleBecomeMerchant = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to become a merchant. We recommend using Hedera Testnet for testing.",
        variant: "destructive"
      });
      try {
        await connect();
        toast({
          title: "Wallet Connected!",
          description: "Great! Now you can apply to become a merchant. Make sure you're on Hedera Testnet.",
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
      return;
    }

    toast({
      title: "Application Started",
      description: "Redirecting to merchant application form. Ensure you have testnet funds for the application process.",
    });
    
    // Here you would typically redirect to application form
    console.log('Redirecting to merchant application...');
  };

  const handleLearnMore = () => {
    toast({
      title: "Merchant Program",
      description: "Learn about our liquidity merchant program and requirements.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Liquidity Merchants
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Verified financial partners facilitating seamless fiat onramp and offramp services across the globe.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wide">Online Now</p>
                <p className="text-xl font-semibold text-white">{onlineMerchants}/{merchants.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wide">Avg Performance</p>
                <p className="text-xl font-semibold text-white">{avgPerformance.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wide">Countries</p>
                <p className="text-xl font-semibold text-white">{countries.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wide">Total Trades</p>
                <p className="text-xl font-semibold text-white">{totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                <Input
                  placeholder="Search merchants or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                />
              </div>
              
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-800">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country} className="bg-gray-800">
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-800">All Status</option>
                <option value="online" className="bg-gray-800">Online</option>
                <option value="offline" className="bg-gray-800">Offline</option>
              </select>
            </div>

            <Button 
              onClick={handleBecomeMerchant}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
            >
              {!isConnected && <Wallet className="w-4 h-4" />}
              <Plus className="w-4 h-4" />
              <span>{!isConnected ? 'Connect & Become a Merchant' : 'Become a Merchant'}</span>
            </Button>
          </div>
        </Card>

        {/* Merchants Grid */}
        {filteredMerchants.length > 0 ? (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        ) : (
          <Card className="glass-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No merchants found</h3>
            <p className="text-gray-300">
              Try adjusting your search criteria or filters to find merchants.
            </p>
          </Card>
        )}

        {/* Become a Merchant CTA */}
        <Card className="glass-card p-8 mt-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Become a Liquidity Merchant
            </h2>
            <p className="text-gray-300 mb-6">
              Join our network of verified financial partners and earn fees by facilitating 
              crypto-to-fiat conversions in your region. Connect your wallet and use Hedera Testnet for testing.
            </p>
            {!isConnected && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-orange-400">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Wallet connection required to proceed</span>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleBecomeMerchant}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
              >
                {!isConnected && <Wallet className="w-4 h-4" />}
                <span>{!isConnected ? 'Connect Wallet & Apply' : 'Apply Now'}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLearnMore}
                className="border-white/20 text-gray-300 hover:bg-white/5"
              >
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Merchants;
