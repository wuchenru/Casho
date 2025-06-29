import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_TRANSACTIONS = gql`
  query GetTransactions($startDate: Date, $endDate: Date, $categoryId: ID) {
    transactions(startDate: $startDate, endDate: $endDate, categoryId: $categoryId) {
      id
      category {
        id
        name
        icon
        color
      }
      type
      amount
      description
      date
      createdAt
    }
  }
`;

const Transactions: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: { 
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      categoryId: categoryFilter || null 
    }
  });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600">Failed to load: {error.message}</div>;

  const transactions = data?.transactions || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Link
          to="/add-transaction"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Add Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              categoryFilter === '' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              categoryFilter === 'income' 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setCategoryFilter('expense')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              categoryFilter === 'expense' 
                ? 'bg-red-100 text-red-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction: any) => (
            <li key={transaction.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: transaction.category?.color || '#3b82f6' }}
                    >
                      <span className="text-white text-sm">{transaction.category?.icon || '💰'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.category?.name || 'Unknown Category'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
            <Link
              to="/add-transaction"
              className="mt-2 inline-block text-primary-600 hover:text-primary-500"
            >
              Add your first transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions; 