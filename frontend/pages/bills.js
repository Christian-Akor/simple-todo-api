import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import api from '../lib/api';

export default function Bills() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wallet, refresh } = useWallet();
  const [selectedService, setSelectedService] = useState('airtime');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    provider: 'mtn',
    amount: '',
    billType: 'airtime',
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

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setFormData({
      ...formData,
      billType: service,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.amount) {
      toast.error('Please fill all required fields');
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
      await api.post('/bills/purchase', {
        phoneNumber: formData.phoneNumber,
        provider: formData.provider,
        amount: parseFloat(formData.amount),
        billType: formData.billType,
      });

      toast.success(`${selectedService} purchase successful!`);
      refresh();
      router.push('/');
    } catch (error) {
      toast.error(error.message || 'Purchase failed');
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Airtime & Bills
          </h1>

          {/* Service Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => handleServiceChange('airtime')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedService === 'airtime'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-medium">Airtime</div>
            </button>
            <button
              onClick={() => handleServiceChange('data')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedService === 'data'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">📡</div>
              <div className="text-sm font-medium">Data</div>
            </button>
            <button
              onClick={() => handleServiceChange('electricity')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedService === 'electricity'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium">Electricity</div>
            </button>
            <button
              onClick={() => handleServiceChange('tv')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedService === 'tv'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">📺</div>
              <div className="text-sm font-medium">TV</div>
            </button>
          </div>

          {/* Purchase Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 capitalize">
              Buy {selectedService}
            </h2>

            {wallet && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl font-bold text-gray-900">
                  {wallet.balance} {wallet.currency || 'NGN'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider <span className="text-red-500">*</span>
                </label>
                <select
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="mtn">MTN</option>
                  <option value="glo">Glo</option>
                  <option value="airtel">Airtel</option>
                  <option value="9mobile">9Mobile</option>
                </select>
              </div>

              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

              <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />

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
                  Purchase
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
