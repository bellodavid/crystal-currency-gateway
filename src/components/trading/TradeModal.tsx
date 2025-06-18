
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Clock, CheckCircle, User, DollarSign, AlertCircle } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: 'buy' | 'sell';
  baseCurrency: string;
  exchangeRate: number;
  userBalance: number;
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const TradeModal = ({ isOpen, onClose, tradeType, baseCurrency, exchangeRate, userBalance }: TradeModalProps) => {
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState<BankAccount>({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [step, setStep] = useState<'amount' | 'details' | 'matching' | 'payment' | 'confirmation'>('amount');
  const [matchedMerchant, setMatchedMerchant] = useState<any>(null);
  const { toast } = useToast();

  const mockMerchant = {
    name: "John Merchant",
    rating: 4.8,
    trades: 1247,
    responseTime: "2 minutes",
    bankDetails: {
      bankName: "First Bank Nigeria",
      accountNumber: "1234567890",
      accountName: "John Merchant Ltd"
    }
  };

  const localAmount = parseFloat(amount || '0') * exchangeRate;

  const handleSubmit = async () => {
    if (step === 'amount') {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }
      
      if (tradeType === 'sell' && parseFloat(amount) > userBalance) {
        toast({
          title: "Insufficient balance",
          description: `You only have ${userBalance} USDT available`,
          variant: "destructive",
        });
        return;
      }

      if (tradeType === 'buy') {
        setStep('details');
      } else {
        setStep('matching');
      }
    } else if (step === 'details') {
      if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
        toast({
          title: "Incomplete details",
          description: "Please fill in all bank details",
          variant: "destructive",
        });
        return;
      }
      setStep('matching');
    } else if (step === 'matching') {
      // Simulate merchant matching - reduced to 1 second
      setTimeout(() => {
        setMatchedMerchant(mockMerchant);
        setStep('payment');
      }, 1000);
    } else if (step === 'payment') {
      setStep('confirmation');
      toast({
        title: "Payment confirmation pending",
        description: "Please wait for merchant confirmation",
      });
    }
  };

  const resetModal = () => {
    setStep('amount');
    setAmount('');
    setBankDetails({ bankName: '', accountNumber: '', accountName: '' });
    setMatchedMerchant(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-orange-400" />
            <span>{tradeType === 'buy' ? 'Buy' : 'Sell'} USDT</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center space-x-1 ${step === 'amount' ? 'text-orange-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${step === 'amount' ? 'bg-orange-400' : 'bg-gray-600'}`} />
              <span>Amount</span>
            </div>
            {tradeType === 'buy' && (
              <div className={`flex items-center space-x-1 ${step === 'details' ? 'text-orange-400' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${step === 'details' ? 'bg-orange-400' : 'bg-gray-600'}`} />
                <span>Details</span>
              </div>
            )}
            <div className={`flex items-center space-x-1 ${step === 'matching' ? 'text-orange-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${step === 'matching' ? 'bg-orange-400' : 'bg-gray-600'}`} />
              <span>Matching</span>
            </div>
            <div className={`flex items-center space-x-1 ${step === 'payment' ? 'text-orange-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${step === 'payment' ? 'bg-orange-400' : 'bg-gray-600'}`} />
              <span>Payment</span>
            </div>
          </div>

          {/* Step Content */}
          {step === 'amount' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Amount in USDT {tradeType === 'sell' && `(Available: ${userBalance})`}
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              {amount && parseFloat(amount) > 0 && (
                <Card className="p-3 bg-gray-800 border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">You {tradeType}:</span>
                    <span className="font-medium">{amount} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">You {tradeType === 'buy' ? 'pay' : 'receive'}:</span>
                    <span className="font-medium">{localAmount.toLocaleString()} {baseCurrency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Rate:</span>
                    <span className="text-sm">1 USDT = {exchangeRate} {baseCurrency}</span>
                  </div>
                </Card>
              )}
            </div>
          )}

          {step === 'details' && tradeType === 'buy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Bank Account Details</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Bank Name"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input
                  placeholder="Account Number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input
                  placeholder="Account Name"
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          )}

          {step === 'matching' && (
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-300">Finding the best merchant for your trade...</p>
              <p className="text-sm text-gray-500">{amount} USDT ↔ {localAmount.toLocaleString()} {baseCurrency}</p>
            </div>
          )}

          {step === 'payment' && matchedMerchant && (
            <div className="space-y-4">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">{matchedMerchant.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    ⭐ {matchedMerchant.rating}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>{matchedMerchant.trades} completed trades</p>
                  <p>Avg response: {matchedMerchant.responseTime}</p>
                </div>
              </Card>

              {tradeType === 'buy' ? (
                <Card className="p-4 bg-orange-500/10 border-orange-500/20">
                  <h4 className="font-medium text-orange-400 mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Payment Instructions
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Bank:</span> {matchedMerchant.bankDetails.bankName}</p>
                    <p><span className="text-gray-400">Account:</span> {matchedMerchant.bankDetails.accountNumber}</p>
                    <p><span className="text-gray-400">Name:</span> {matchedMerchant.bankDetails.accountName}</p>
                    <p><span className="text-gray-400">Amount:</span> {localAmount.toLocaleString()} {baseCurrency}</p>
                  </div>
                  <p className="text-xs text-orange-300 mt-2">
                    Transfer exactly {localAmount.toLocaleString()} {baseCurrency} to the above account and click "Payment Sent"
                  </p>
                </Card>
              ) : (
                <Card className="p-4 bg-green-500/10 border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Awaiting Your Bank Details
                  </h4>
                  <p className="text-sm text-gray-300">
                    Please provide your bank details to receive {localAmount.toLocaleString()} {baseCurrency}
                  </p>
                </Card>
              )}
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Transaction Pending</h3>
                <p className="text-sm text-gray-400">
                  {tradeType === 'buy' 
                    ? 'Waiting for merchant to confirm payment receipt' 
                    : 'Waiting for you to confirm receipt of funds'
                  }
                </p>
              </div>
              {tradeType === 'sell' && (
                <Button 
                  onClick={() => {
                    toast({
                      title: "Transaction completed!",
                      description: "USDT has been transferred to merchant",
                    });
                    handleClose();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Confirm Receipt
                </Button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {step !== 'confirmation' && (
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={step === 'matching'}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {step === 'amount' && 'Continue'}
                {step === 'details' && 'Find Merchant'}
                {step === 'matching' && 'Matching...'}
                {step === 'payment' && (tradeType === 'buy' ? 'Payment Sent' : 'Confirm Details')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
