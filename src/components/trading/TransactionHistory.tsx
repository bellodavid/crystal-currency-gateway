
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, ArrowUpDown, Eye } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  currency: string;
  localAmount: number;
  rate: number;
  status: 'pending' | 'completed' | 'failed';
  merchantAddress: string;
  timestamp: string;
}

interface TransactionHistoryProps {
  newTransaction?: Transaction;
}

const TransactionHistory = ({ newTransaction }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      amount: 500,
      currency: 'NGN',
      localAmount: 850000,
      rate: 1700,
      status: 'completed',
      merchantAddress: '0x742d35Cc6634C0532925a3b8D3Ac92f',
      timestamp: '2024-01-15 14:30:22'
    },
    {
      id: '2',
      type: 'sell',
      amount: 200,
      currency: 'KES',
      localAmount: 27000,
      rate: 135,
      status: 'pending',
      merchantAddress: '0x892e45Dd7745D1543936b9e4E4Bd95g',
      timestamp: '2024-01-15 16:45:10'
    },
    {
      id: '3',
      type: 'buy',
      amount: 1000,
      currency: 'GHS',
      localAmount: 12500,
      rate: 12.5,
      status: 'failed',
      merchantAddress: '0x123f56Ee8856E2654847c0f5F5Ce06h',
      timestamp: '2024-01-14 09:15:33'
    }
  ]);

  // Add new transaction when received
  useEffect(() => {
    if (newTransaction) {
      setTransactions(prev => [newTransaction, ...prev]);
    }
  }, [newTransaction]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ArrowUpDown className="w-5 h-5 mr-2 text-orange-400" />
          Transaction History
        </h2>
        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
          <Eye className="w-4 h-4 mr-1" />
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Rate</TableHead>
              <TableHead className="text-gray-400">Merchant</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-gray-700 hover:bg-white/5">
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={tx.type === 'buy' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                  >
                    {tx.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">
                  <div>
                    <div className="font-medium">{tx.amount} USDT</div>
                    <div className="text-xs text-gray-400">
                      {tx.localAmount.toLocaleString()} {tx.currency}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  1 USDT = {tx.rate} {tx.currency}
                </TableCell>
                <TableCell className="text-gray-300">
                  <div className="font-mono text-xs">
                    {tx.merchantAddress.slice(0, 8)}...{tx.merchantAddress.slice(-6)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(tx.status)}
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {new Date(tx.timestamp).toLocaleDateString()}
                  <div className="text-xs">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <ArrowUpDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No transactions yet</h3>
          <p className="text-gray-500">Your trading history will appear here</p>
        </div>
      )}
    </Card>
  );
};

export default TransactionHistory;
