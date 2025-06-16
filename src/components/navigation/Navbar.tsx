
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Settings, 
  Wallet,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trading Pool', icon: Coins },
    { path: '/contribute', label: 'Contribute', icon: TrendingUp },
    { path: '/merchants', label: 'Merchants', icon: Users },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-crystal-gradient rounded-lg crystal-glow"></div>
              <div className="absolute inset-0 w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-crystal-400 to-gold-400 bg-clip-text text-transparent">
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
                    ? 'bg-crystal-500/20 text-crystal-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <Button className="bg-crystal-gradient hover:opacity-90 text-white font-semibold">
              Connect Wallet
            </Button>
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
                      ? 'bg-crystal-500/20 text-crystal-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="pt-4">
                <Button className="w-full bg-crystal-gradient hover:opacity-90 text-white font-semibold">
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
