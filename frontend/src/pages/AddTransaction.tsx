import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_CATEGORIES = gql`
  query GetCategories($type: String) {
    categories(type: $type) {
      id
      name
      type
      icon
      color
    }
  }
`;

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      description
      date
      category {
        id
        name
      }
    }
  }
`;

interface TransactionForm {
  category_id: number;
  amount: number;
  description: string;
  date: string;
}

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  
  const { data: categoriesData, refetch: refetchCategories } = useQuery(GET_CATEGORIES, {
    variables: { type: transactionType },
    fetchPolicy: 'network-only',
  });
  
  const [createTransaction, { loading, error }] = useMutation(CREATE_TRANSACTION);
  const { register, handleSubmit, formState: { errors } } = useForm<TransactionForm>();

  useEffect(() => {
    refetchCategories();
  }, [transactionType, refetchCategories]);

  const onSubmit = async (data: TransactionForm) => {
    try {
      await createTransaction({
        variables: {
          input: data
        }
      });
      
      navigate('/transactions');
    } catch (err) {
      console.error('Failed to create transaction:', err);
    }
  };

  const categories = categoriesData?.categories || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Transaction Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                transactionType === 'expense'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                transactionType === 'income'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register('category_id', { required: 'Please select a category' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Please select a category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                {...register('amount', { 
                  required: 'Please enter amount',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                type="number"
                step="0.01"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              {...register('description')}
              type="text"
              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Transaction description (optional)"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              {...register('date', { required: 'Please select a date' })}
              type="date"
              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error.message}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction; 