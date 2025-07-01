import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_USER = gql`
  query GetUser {
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

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      phone
      avatar
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      success
      errors
    }
  }
`;

const Profile: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_USER);
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const user = data?.me;
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600">Failed to load: {error.message}</div>;

  const openEdit = () => {
    setForm({ username: user?.username || '', email: user?.email || '', phone: user?.phone || '' });
    setEditOpen(true);
    setMsg('');
  };

  const openPassword = () => {
    setPasswordForm({ oldPassword: '', newPassword: '' });
    setPasswordOpen(true);
    setMsg('');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ variables: { input: form } });
      setEditOpen(false);
      refetch();
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await changePassword({ variables: passwordForm });
      if (res.data.changePassword.success) {
        setPasswordOpen(false);
      } else {
        setMsg(res.data.changePassword.errors?.join(', ') || 'Change failed');
      }
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Registration date: {new Date(user?.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {user?.phone || 'Not set'}
                  </p>
                </div>

                {/* Account Statistics */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Days Registered</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.floor((new Date().getTime() - new Date(user?.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <p className="text-2xl font-bold text-green-600">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Membership Level</p>
                      <p className="text-2xl font-bold text-gray-900">Standard User</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-6">
                  <div className="flex space-x-4">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700" onClick={openEdit}>
                      Edit Profile
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700" onClick={openPassword}>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleEdit}>
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <input className="w-full mb-2 p-2 border rounded" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            <input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="w-full mb-2 p-2 border rounded" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            {msg && <div className="text-red-500 text-sm mb-2">{msg}</div>}
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-3 py-1" onClick={() => setEditOpen(false)}>Cancel</button>
              <button type="submit" className="bg-primary-600 text-white px-3 py-1 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
      {passwordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow w-80" onSubmit={handlePassword}>
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Old Password" value={passwordForm.oldPassword} onChange={e => setPasswordForm(f => ({ ...f, oldPassword: e.target.value }))} />
            <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} />
            {msg && <div className="text-red-500 text-sm mb-2">{msg}</div>}
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-3 py-1" onClick={() => setPasswordOpen(false)}>Cancel</button>
              <button type="submit" className="bg-primary-600 text-white px-3 py-1 rounded">Change</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile; 