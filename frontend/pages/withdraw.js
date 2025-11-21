import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import PinInput from '../components/PinInput';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import api from '../lib/api';

export default function Withdraw() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wallet, refresh } = useWallet();
  const [formData, setFormData] = useState({
    amount: '',
    bankAccount: '',
    pin: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePinComplete = (pin) => {
    setFormData({
      ...formData,
      pin,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.bankAccount || !formData.pin) {
      toast.error('Please fill all fields including PIN');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (wallet && parseFloat(formData.amount) > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      await api.post('/wallet/withdraw', {
        amount: parseFloat(formData.amount),
        bankAccount: formData.bankAccount,
        pin: formData.pin,
      });

      toast.success('Withdrawal request submitted!');
      refresh();
      router.push('/');
    } catch (error) {
      toast.error(error.message || 'Withdrawal failed');
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
              Withdraw Money
            </h1>

            {wallet && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl font-bold text-gray-900">
                  {wallet.balance} {wallet.currency || 'NGN'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount to withdraw"
                min="1"
                step="0.01"
                required
              />

              <Input
                label="Bank Account Number"
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="Enter your bank account number"
                required
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction PIN <span className="text-red-500">*</span>
                </label>
                <PinInput length={4} onComplete={handlePinComplete} />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Withdrawal may take 1-3 business days to process.
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
                  Withdraw
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
