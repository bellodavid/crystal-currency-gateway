
import { DynamicFeeCalculation } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Activity, Shield } from 'lucide-react';

interface FeeBreakdownProps {
  feeCalculation: DynamicFeeCalculation;
}

const FeeBreakdown = ({ feeCalculation }: FeeBreakdownProps) => {
  const feeComponents = [
    {
      label: 'Base Fee',
      value: feeCalculation.baseFee,
      description: 'Standard trading fee',
      icon: Shield,
      color: 'text-blue-400',
    },
    {
      label: 'Volatility Fee',
      value: feeCalculation.volatilityFee,
      description: `${feeCalculation.rateChangePercentage.toFixed(2)}% rate change`,
      icon: TrendingUp,
      color: 'text-yellow-400',
    },
    {
      label: 'Pool Health Fee',
      value: feeCalculation.poolHealthFee,
      description: `${feeCalculation.poolImbalance.toFixed(1)}% imbalance`,
      icon: Activity,
      color: 'text-green-400',
    },
  ];

  return (
    <Card className="glass-card p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">Fee Breakdown</h3>
          <span className="text-sm font-semibold text-white">
            {feeCalculation.totalFee.toFixed(2)}% Total
          </span>
        </div>

        <div className="space-y-3">
          {feeComponents.map((component, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <component.icon className={`w-3 h-3 ${component.color}`} />
                  <span className="text-gray-400">{component.label}</span>
                </div>
                <span className="text-white font-medium">{component.value.toFixed(2)}%</span>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={(component.value / 8) * 100} 
                  className="h-1 bg-white/10"
                />
                <p className="text-xs text-gray-500">{component.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Fee Cap (Max)</span>
            <span className="text-gray-500">8.00%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeeBreakdown;
