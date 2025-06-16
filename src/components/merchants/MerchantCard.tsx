
import { Merchant } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Wallet,
  Activity
} from 'lucide-react';
import { formatCurrency } from '@/utils/liquidityCalculations';

interface MerchantCardProps {
  merchant: Merchant;
}

const MerchantCard = ({ merchant }: MerchantCardProps) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 95) return 'EXCELLENT';
    if (score >= 90) return 'GOOD';
    if (score >= 85) return 'AVERAGE';
    return 'POOR';
  };

  return (
    <Card className="glass-card p-6 hover:bg-white/5 transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{merchant.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{merchant.country}</span>
              <span>•</span>
              <span>{merchant.currency}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant={merchant.isOnline ? "default" : "secondary"}
              className={merchant.isOnline ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
            >
              {merchant.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>

        {/* Performance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Performance Score</span>
            <span className={`font-semibold ${getPerformanceColor(merchant.performanceScore)}`}>
              {merchant.performanceScore.toFixed(1)}% ({getPerformanceGrade(merchant.performanceScore)})
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                merchant.performanceScore >= 95 ? 'bg-green-500' :
                merchant.performanceScore >= 90 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${merchant.performanceScore}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Wallet className="w-4 h-4 text-crystal-400" />
              <div>
                <p className="text-gray-400">Available</p>
                <p className="text-white font-medium">
                  {formatCurrency(merchant.availableBalance, merchant.currency)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Activity className="w-4 h-4 text-gold-400" />
              <div>
                <p className="text-gray-400">Book Balance</p>
                <p className="text-white font-medium">
                  {formatCurrency(merchant.bookBalance, merchant.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-gray-400">Completion</p>
                <p className="text-white font-medium">{merchant.completionRate.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-gray-400">Avg Time</p>
                <p className="text-white font-medium">{merchant.averageProcessingTime.toFixed(1)}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Transactions</span>
            <span className="text-white font-medium">{merchant.totalTransactions.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MerchantCard;
