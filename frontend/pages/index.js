import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/format';
import api from '../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wallet, loading: walletLoading } = useWallet();
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch transactions count
  useEffect(() => {
    const fetchTransactionsCount = async () => {
      try {
        const response = await api.get('/transactions?limit=1');
        setTransactionsCount(response.data.total || 0);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactionsCount();
    }
  }, [user]);

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
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || user.email || user.phone}!
          </h1>
          <p className="text-gray-600">Manage your wallet and transactions</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8 text-white">
          <p className="text-sm opacity-90 mb-2">Total Balance</p>
          {walletLoading ? (
            <div className="h-12 w-48 bg-blue-500 animate-pulse rounded"></div>
          ) : wallet ? (
            <h2 className="text-4xl font-bold mb-4">
              {formatCurrency(wallet.balance, wallet.currency || 'NGN')}
            </h2>
          ) : (
            <h2 className="text-4xl font-bold mb-4">0.00 NGN</h2>
          )}
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/fund"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Fund Wallet
            </Link>
            <Link
              href="/transfer"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
            >
              Transfer
            </Link>
            <Link
              href="/withdraw"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
            >
              Withdraw
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : transactionsCount}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <Link href="/transactions" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
              View all →
            </Link>
          </div>

          {/* Bills */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pay Bills</p>
                <p className="text-lg font-medium text-gray-900">Airtime & More</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <Link href="/bills" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
              Pay now →
            </Link>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Account</p>
                <p className="text-lg font-medium text-gray-900 truncate">
                  {user.email || user.phone}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
