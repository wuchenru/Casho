import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_TRANSACTIONS = gql`
  query GetTransactions($type: String, $categoryId: Int) {
    transactions(type: $type, categoryId: $categoryId) {
      id
      categoryName
      categoryIcon
      categoryColor
      type
      amount
      description
      date
      createdAt
    }
  }
`;

const Transactions: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: { type: typeFilter || null }
  });

  if (loading) return <div className="text-center">加载中...</div>;
  if (error) return <div className="text-red-600">加载失败: {error.message}</div>;

  const transactions = data?.transactions || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">交易记录</h1>
        <Link
          to="/add-transaction"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          添加交易
        </Link>
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

      {/* 交易列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction: any) => (
            <li key={transaction.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: transaction.categoryColor }}
                    >
                      <span className="text-white text-sm">{transaction.categoryIcon || '💰'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.categoryName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.description || '无描述'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}¥{parseFloat(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无交易记录</p>
            <Link
              to="/add-transaction"
              className="mt-2 inline-block text-primary-600 hover:text-primary-500"
            >
              添加第一笔交易
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions; 