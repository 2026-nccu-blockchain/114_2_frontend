import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/hooks/useProfile';

export default function Profile() {
  const { role } = useAuthStore();

  const [fullName, setFullName] = useState(
    `Demo ${role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}`
  );
  const [phone, setPhone] = useState('0912-000-111');
  const [avatarUrl, setAvatarUrl] = useState(
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>...</svg>"
  );

  const { updateProfile, loading, error, success } = useProfile();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile({
      fullName: fullName,
      phone: phone,
      avatarUrl: avatarUrl,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
            {fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">{role}@demo.local</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-teal-50 text-teal-600 text-xs font-medium rounded">
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}
            </span>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</div>}
        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-2.5 rounded-lg">
            儲存成功
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono text-xs truncate"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
