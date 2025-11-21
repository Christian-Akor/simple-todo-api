import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/format';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { wallet } = useWallet();

  return (
    <nav className="bg-white shadow-md">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              TodoWallet
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/transactions" className="text-gray-700 hover:text-blue-600">
                  Transactions
                </Link>
                <Link href="/bills" className="text-gray-700 hover:text-blue-600">
                  Bills
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
              </>
            ) : null}
          </div>

          {/* Right side - Wallet & Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {wallet && (
                  <div className="hidden sm:flex items-center bg-green-50 px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-green-700">
                      Balance: {formatCurrency(wallet.balance, wallet.currency || 'NGN')}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {user.email || user.phone}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
