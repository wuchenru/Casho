import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      username
      email
      phone
      avatar
      createdAt
    }
  }
`;

const Profile: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  if (loading) return <div className="text-center">加载中...</div>;
  if (error) return <div className="text-red-600">加载失败: {error.message}</div>;

  const user = data?.me;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">个人资料</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* 头像 */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="头像"
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500 text-xl">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {user?.username}
                </h3>
                <p className="text-sm text-gray-500">
                  注册时间: {new Date(user?.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  用户名
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  邮箱地址
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  手机号码
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.phone || '未设置'}
                </p>
              </div>
            </div>

            {/* 账户统计 */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">账户统计</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">注册天数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor((Date.now() - new Date(user?.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">账户状态</p>
                  <p className="text-2xl font-bold text-green-600">正常</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">会员等级</p>
                  <p className="text-2xl font-bold text-gray-900">普通用户</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-3">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                  编辑资料
                </button>
                <button className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  修改密码
                </button>
                <button className="bg-white text-red-600 px-4 py-2 border border-red-300 rounded-md hover:bg-red-50">
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 