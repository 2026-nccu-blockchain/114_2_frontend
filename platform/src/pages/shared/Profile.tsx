import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/hooks/useProfile';
import '@/styles/pages/shared/Profile.css';

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile({
      fullName: fullName,
      phone: phone,
      avatarUrl: avatarUrl,
    });
  };

  return (
    <div className="sharedProfile__page">
      <h1 className="sharedProfile__title">Profile</h1>

      <div className="sharedProfile__panel">
        <div className="sharedProfile__style">
          <div className="sharedProfile__style2">
            {fullName.charAt(0)}
          </div>
          <div>
            <h2 className="sharedProfile__sectionTitle">{fullName}</h2>
            <p className="sharedProfile__mutedText">{role}@demo.local</p>
            <span className="sharedProfile__style3">
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}
            </span>
          </div>
        </div>

        {error && <div className="sharedProfile__style4">{error}</div>}
        {success && (
          <div className="sharedProfile__style5">
            儲存成功
          </div>
        )}

        <form onSubmit={handleSubmit} className="sharedProfile__page2">
          <div>
            <label className="sharedProfile__style6">
              Full Name <span className="sharedProfile__required">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="sharedProfile__input"
            />
          </div>

          <div>
            <label className="sharedProfile__style6">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="sharedProfile__input"
            />
          </div>

          <div>
            <label className="sharedProfile__style6">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="sharedProfile__input2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sharedProfile__primaryButton"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
