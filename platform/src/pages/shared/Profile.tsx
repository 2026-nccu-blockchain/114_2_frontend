import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfile, type UpdateProfileData } from '@/hooks/useProfile';

export default function Profile() {
  const { role } = useAuthStore();
  const { fetchProfile, updateProfile, deleteAccount, loading, error, success } = useProfile();
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProfile();
      if (data) {
        setUserId(data.uuid || data.id || '');
        setFullName(data.name || '');
        setEmail(data.email || '');
        setAvatarUrl(data.avatar_url || '');
        
        if (role !== 'admin') {
          setPhone(data.phone || '');
        }
        if (role === 'buyer') {
          setAddress(data.address || '');
        }
        if (role === 'seller') {
          setCompanyAddress(data.company_address || '');
          setCompanyPhone(data.company_phone || '');
          setCompanyName(data.company_name || '');
        }
      }
    };
    loadData();
  }, [role]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    let payload: UpdateProfileData = {
      email: email,
      name: fullName,
      avatar_url: avatarUrl
    };

    if (role === 'buyer') {
      payload = { ...payload, phone, address };
    } else if (role === 'seller') {
      payload = { 
        ...payload, 
        phone, 
        company_address: companyAddress, 
        company_phone: companyPhone, 
        company_name: companyName 
      };
    } else if (role === 'driver') {
      payload = { ...payload, phone };
    }

    await updateProfile(payload);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
              {fullName ? fullName.charAt(0) : role?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{fullName || '載入中...'}</h2>
            <p className="text-sm text-gray-500">{email || '---'}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-teal-50 text-teal-600 text-xs font-medium rounded capitalize">
              {role}
            </span>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600 bg-green-50 p-2.5 rounded-lg">資料更新成功！</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://example.com/image.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono text-xs"
            />
          </div>
          {role !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          )}
          {role === 'buyer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          )}
          {role === 'seller' && (
            <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900">Company Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-60 shadow-sm"
            >
              {loading ? '儲存中...' : 'Save Changes'}
            </button>
          </div>
        </form>
        {role !== 'admin' && (
          <div className="mt-12 pt-6 border-t border-red-100">
            <h3 className="text-red-600 font-medium mb-1">Danger Zone</h3>
            <p className="text-xs text-gray-500 mb-4">
              帳號刪除後將無法復原，請謹慎操作。
            </p>
            <button
              onClick={() => deleteAccount(userId)}
              disabled={loading || !userId}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-medium rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}