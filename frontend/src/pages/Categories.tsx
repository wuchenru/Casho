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

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY);

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
      console.error('创建分类失败:', err);
    }
  };

  if (loading) return <div className="text-center">加载中...</div>;
  if (error) return <div className="text-red-600">加载失败: {error.message}</div>;

  const categories = data?.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          添加分类
        </button>
      </div>

      {/* 过滤器 */}
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
            全部
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              typeFilter === 'income' 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            收入
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              typeFilter === 'expense' 
                ? 'bg-red-100 text-red-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            支出
          </button>
        </div>
      </div>

      {/* 添加分类表单 */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">添加新分类</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">分类名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="expense">支出</option>
                  <option value="income">收入</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">图标</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="💰"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">颜色</label>
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
                取消
              </button>
              <button
                type="submit"
                disabled={creating}
                className="bg-primary-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
              >
                {creating ? '创建中...' : '创建'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 分类列表 */}
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
                        {category.type === 'income' ? '收入' : '支出'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无分类</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-primary-600 hover:text-primary-500"
            >
              添加第一个分类
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories; 