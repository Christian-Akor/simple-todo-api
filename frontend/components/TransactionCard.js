import { formatCurrency } from '../utils/format';
import clsx from 'clsx';

export default function TransactionCard({ transaction }) {
  const { type, amount, currency, status, description, createdAt, toUser, fromUser } = transaction;

  // Determine transaction direction and styling
  const isCredit = type === 'credit' || type === 'fund';
  const isDebit = type === 'debit' || type === 'transfer' || type === 'withdraw';

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Transaction Type & Description */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={clsx(
              'text-sm font-medium px-2 py-1 rounded',
              isCredit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            )}>
              {type?.toUpperCase()}
            </span>
            {status && (
              <span className={clsx('text-xs px-2 py-1 rounded', statusColors[status] || statusColors.pending)}>
                {status}
              </span>
            )}
          </div>
          
          <p className="text-gray-800 font-medium mb-1">
            {description || 'Transaction'}
          </p>
          
          {/* Additional Info */}
          <div className="text-sm text-gray-600 space-y-1">
            {toUser && (
              <p>To: {toUser.email || toUser.phone || 'User'}</p>
            )}
            {fromUser && (
              <p>From: {fromUser.email || fromUser.phone || 'User'}</p>
            )}
            {createdAt && (
              <p className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="text-right ml-4">
          <p className={clsx(
            'text-lg font-bold',
            isCredit ? 'text-green-600' : 'text-red-600'
          )}>
            {isCredit ? '+' : '-'}{formatCurrency(amount, currency || 'NGN')}
          </p>
        </div>
      </div>
    </div>
  );
}
