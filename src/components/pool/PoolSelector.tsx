
import { useState } from 'react';
import { Pool } from '@/types/liquidity';
import { Card } from '@/components/ui/card';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/liquidityCalculations';

interface PoolSelectorProps {
  pools: Pool[];
  selectedPool: Pool;
  onPoolSelect: (pool: Pool) => void;
}

const PoolSelector = ({ pools, selectedPool, onPoolSelect }: PoolSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPriceChange = (pool: Pool) => {
    const change = ((pool.exchangeRate - pool.previousRate) / pool.previousRate) * 100;
    return change;
  };

  return (
    <div className="relative">
      <Card 
        className="glass-card cursor-pointer hover:bg-white/10 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-crystal-400 to-crystal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {selectedPool.baseCurrency.slice(0, 2)}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                UT
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {selectedPool.baseCurrency}/USDT
              </h3>
              <p className="text-sm text-gray-400">
                Rate: {formatNumber(selectedPool.exchangeRate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-1">
                {getPriceChange(selectedPool) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  getPriceChange(selectedPool) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {getPriceChange(selectedPool) >= 0 ? '+' : ''}{getPriceChange(selectedPool).toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-gray-400">24h change</p>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card border border-white/10 rounded-lg overflow-hidden z-10">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className="p-4 hover:bg-white/5 cursor-pointer transition-all duration-200 border-b border-white/5 last:border-b-0"
              onClick={() => {
                onPoolSelect(pool);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-crystal-400 to-crystal-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {pool.baseCurrency.slice(0, 2)}
                    </div>
                    <div className="w-6 h-6 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      UT
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-white">{pool.baseCurrency}/USDT</p>
                    <p className="text-xs text-gray-400">
                      TVL: {formatCurrency(pool.totalLiquidity, 'USD')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-white">{formatNumber(pool.exchangeRate)}</p>
                  <div className="flex items-center space-x-1">
                    {getPriceChange(pool) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${
                      getPriceChange(pool) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {getPriceChange(pool) >= 0 ? '+' : ''}{getPriceChange(pool).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoolSelector;
