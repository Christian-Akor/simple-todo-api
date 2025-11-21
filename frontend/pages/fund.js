import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import api from '../lib/api';

export default function FundWallet() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refresh } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/wallet/add-money', {
        amount: parseFloat(amount),
      });

      // Open checkout URL in new tab if provided
      if (response.data.checkoutUrl) {
        toast.success('Redirecting to payment gateway...');
        window.open(response.data.checkoutUrl, '_blank');
        
        // Refresh wallet after a delay (user might complete payment)
        setTimeout(() => {
          refresh();
        }, 3000);
        
        router.push('/');
      } else {
        toast.success('Wallet funded successfully!');
        refresh();
        router.push('/');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fund wallet');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Fund Wallet
            </h1>

            <form onSubmit={handleSubmit}>
              <Input
                label="Amount"
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to add"
                min="1"
                step="0.01"
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You will be redirected to a secure payment gateway to complete your transaction.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
