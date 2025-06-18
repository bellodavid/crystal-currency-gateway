
import { Pool } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/liquidityCalculations';

interface PoolStatsProps {
  pool: Pool;
}

const PoolStats = ({ pool }: PoolStatsProps) => {
  const stats = [
    {
      label: 'Total Liquidity',
      value: formatCurrency(pool.totalLiquidity, 'USD'),
      icon: DollarSign,
      color: 'text-crystal-400',
      bgColor: 'bg-crystal-500/10',
    },
    {
      label: '24h Volume',
      value: formatCurrency(pool.volume24h, pool.baseCurrency),
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'APY',
      value: `${pool.apy}%`,
      icon: TrendingUp,
      color: 'text-gold-400',
      bgColor: 'bg-gold-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card p-4 hover:bg-white/5 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide truncate">{stat.label}</p>
              <p className="text-base sm:text-lg font-semibold text-white truncate">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PoolStats;
