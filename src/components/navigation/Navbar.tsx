
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Wallet,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const location = useLocation();
  const { isConnected, address, balance, network, connect, disconnect } = useWallet();

  const navItems = [
    { path: '/', label: 'Trading Pool', icon: Coins },
    { path: '/contribute', label: 'Contribute', icon: TrendingUp },
    { path: '/merchants', label: 'Merchants', icon: Users },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
  ];

  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://media.bananacrystal.com/wp-content/uploads/2024/07/24181620/Logo-128x128-2.png" 
              alt="BananaCrystal" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
              BananaCrystal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="hidden md:block relative">
            {isConnected ? (
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                  className="border-orange-500/50 text-white hover:bg-orange-500/10 flex items-center space-x-2"
                >
                  <Wallet size={16} />
                  <span>{formatAddress(address!)}</span>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                    {network}
                  </Badge>
                  <ChevronDown size={14} />
                </Button>

                {showWalletDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-white/10 rounded-lg shadow-xl p-4 z-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Network</span>
                        <Badge className="bg-green-500/20 text-green-400">
                          Hedera Testnet
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">USDT</span>
                          <span className="text-white font-medium">{balance.USDT.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">HBAR</span>
                          <span className="text-white font-medium">{balance.HBAR.toFixed(2)}</span>
                        </div>
                      </div>

                      <hr className="border-white/10" />
                      
                      <Button
                        onClick={() => {
                          disconnect();
                          setShowWalletDropdown(false);
                        }}
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={connect}
                className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              
              <div className="pt-4">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Connected: {formatAddress(address!)}</div>
                      <div className="flex justify-between text-sm">
                        <span>USDT: {balance.USDT.toLocaleString()}</span>
                        <span>HBAR: {balance.HBAR.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={disconnect}
                      variant="outline" 
                      className="w-full border-red-500/50 text-red-400"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={connect}
                    className="w-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
