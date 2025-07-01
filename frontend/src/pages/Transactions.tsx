import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext';

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
  const { currency, rates } = useCurrency();

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
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction: any) => (
              <tr key={transaction.id}>
                <td className="py-2">{transaction.description || 'No description'}</td>
                <td className="py-2 text-right">
                  {(rates[currency] ? parseFloat(transaction.amount) * rates[currency] : parseFloat(transaction.amount)).toLocaleString(undefined, { style: 'currency', currency })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
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