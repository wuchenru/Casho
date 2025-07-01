import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext';

const GET_TRANSACTION_STATS = gql`
  query GetTransactionStats($startDate: Date, $endDate: Date) {
    stats(startDate: $startDate, endDate: $endDate) {
      totalIncome
      totalExpense
      balance
      categoryStats
    }
  }
`;

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
      currency
      balance
    }
  }
`;

const Dashboard: React.FC = () => {
  const { currency, rates } = useCurrency();
  const { loading, error, data } = useQuery(GET_TRANSACTION_STATS, {
    variables: { 
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    }
  });
  const { data: accountsData, loading: accountsLoading, error: accountsError } = useQuery(GET_ACCOUNTS);

  if (loading || accountsLoading) return <div className="text-center">Loading...</div>;
  if (error || accountsError) return <div className="text-red-600">Failed to load: {(error || accountsError)?.message}</div>;

  const stats = data?.stats;
  const accounts = accountsData?.accounts || [];
  // 多币种总资产计算
  const totalAssets = accounts.reduce((sum: number, acc: any) => {
    const rate = rates[currency] && rates[acc.currency] ? rates[currency] / rates[acc.currency] : 1;
    return sum + parseFloat(acc.balance) * rate;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/add-transaction"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Add Transaction
        </Link>
      </div>

      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="text-gray-500">Total Assets</div>
        <div className="text-3xl font-bold">{totalAssets.toLocaleString(undefined, { style: 'currency', currency })}</div>
        <div className="text-sm text-gray-400 mt-1">All accounts converted to {currency}</div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-lg">+</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats?.totalIncome?.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <span className="text-red-600 text-lg">-</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Expense</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats?.totalExpense?.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-lg">=</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Balance</dt>
                  <dd className={`text-lg font-medium ${stats?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${stats?.balance?.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Category Statistics
          </h3>
          <div className="space-y-4">
            {stats?.categoryStats && Object.entries(stats.categoryStats).map(([categoryName, amount]: [string, any], index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: '#3b82f6' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    {categoryName}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ${parseFloat(amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-transaction"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Add Transaction
            </Link>
            <Link
              to="/transactions"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Transactions
            </Link>
            <Link
              to="/categories"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 