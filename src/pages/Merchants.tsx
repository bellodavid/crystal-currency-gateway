
import { useState, useEffect } from 'react';
import { Merchant } from '@/types/liquidity';
import { mockMerchants, updateMerchantPerformance } from '@/data/mockData';
import Navbar from '@/components/navigation/Navbar';
import MerchantCard from '@/components/merchants/MerchantCard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const Merchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-crystal-400 via-gold-400 to-crystal-400 bg-clip-text text-transparent">
              Liquidity Merchants
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Verified financial partners facilitating seamless fiat onramp and offramp services across the globe.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Online Now</p>
                <p className="text-xl font-semibold text-white">{onlineMerchants}/{merchants.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Avg Performance</p>
                <p className="text-xl font-semibold text-white">{avgPerformance.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Countries</p>
                <p className="text-xl font-semibold text-white">{countries.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gold-500/10 rounded-lg">
                <Users className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Trades</p>
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
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search merchants or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>
              
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-crystal-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country} className="bg-slate-800">
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-crystal-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="online" className="bg-slate-800">Online</option>
                <option value="offline" className="bg-slate-800">Offline</option>
              </select>
            </div>

            <Button className="bg-crystal-gradient hover:opacity-90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Become a Merchant
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
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No merchants found</h3>
            <p className="text-gray-400">
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
              crypto-to-fiat conversions in your region. Strict KYC requirements apply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-crystal-gradient hover:opacity-90 text-white">
                Apply Now
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
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
