import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_TRANSACTION_STATS = gql`
  query GetTransactionStats($period: String) {
    transactionStats(period: $period) {
      period
      incomeTotal
      expenseTotal
      balance
      categoryStats
    }
  }
`;

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TRANSACTION_STATS, {
    variables: { period: 'month' }
  });

  if (loading) return <div className="text-center">加载中...</div>;
  if (error) return <div className="text-red-600">加载失败: {error.message}</div>;

  const stats = data?.transactionStats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <Link
          to="/add-transaction"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          添加交易
        </Link>
      </div>

      {/* 统计卡片 */}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">总收入</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ¥{stats?.incomeTotal?.toFixed(2) || '0.00'}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">总支出</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ¥{stats?.expenseTotal?.toFixed(2) || '0.00'}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">余额</dt>
                  <dd className={`text-lg font-medium ${stats?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ¥{stats?.balance?.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分类统计 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            分类统计
          </h3>
          <div className="space-y-4">
            {stats?.categoryStats?.map((category: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: category.type === 'income' ? '#22c55e' : '#ef4444' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.category__name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ¥{parseFloat(category.total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            快速操作
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-transaction"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              添加交易
            </Link>
            <Link
              to="/transactions"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              查看交易记录
            </Link>
            <Link
              to="/categories"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              管理分类
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 