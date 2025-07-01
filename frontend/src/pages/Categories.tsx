import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_CATEGORIES = gql`
  query GetCategories($type: String) {
    categories(type: $type) {
      id
      name
      type
      icon
      color
      createdAt
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      type
      icon
      color
    }
  }
`;

const Categories: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: '',
    color: '#3b82f6'
  });

  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES, {
    variables: { type: typeFilter || null }
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES, variables: { type: typeFilter || null } }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({
        variables: {
          input: formData
        }
      });
      setFormData({ name: '', type: 'expense', icon: '', color: '#3b82f6' });
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600">Failed to load: {error.message}</div>;

  const categories = data?.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              typeFilter === '' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              typeFilter === 'income' 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              typeFilter === 'expense' 
                ? 'bg-red-100 text-red-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="💰"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="bg-primary-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories.map((category: any) => (
            <li key={category.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: category.color }}
                    >
                      <span className="text-white text-lg">{category.icon || '💰'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {category.type === 'income' ? 'Income' : 'Expense'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 inline-block text-primary-600 hover:text-primary-500"
            >
              Create your first category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories; 