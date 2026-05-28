import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/hooks/useProfile';
import { styles } from '@/styles/pages/shared/Profile.styles';

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
    <div className={styles.page}>
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.panel}>
        <div className={styles.style}>
          <div className={styles.style2}>
            {fullName.charAt(0)}
          </div>
          <div>
            <h2 className={styles.sectionTitle}>{fullName}</h2>
            <p className={styles.mutedText}>{role}@demo.local</p>
            <span className={styles.style3}>
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}
            </span>
          </div>
        </div>

        {error && <div className={styles.style4}>{error}</div>}
        {success && (
          <div className={styles.style5}>
            儲存成功
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.page2}>
          <div>
            <label className={styles.style6}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.style6}>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.style6}>Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className={styles.input2}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
