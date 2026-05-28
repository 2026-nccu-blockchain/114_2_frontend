import { useState, useEffect, type SyntheticEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfile, type UpdateProfileData } from '@/hooks/useProfile';
import '@/styles/pages/shared/Profile.css'; 

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

  // 1. 初始化拉取後端真實資料 (遵循規格書)
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

  // 2. 處理資料更新送出
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
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
    <div className="sharedProfile__page">
      <h1 className="sharedProfile__title">Profile Settings</h1>

      <div className="sharedProfile__panel">
        
        {/* 上方使用者資訊卡區 */}
        <div className="sharedProfile__style">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="sharedProfile__style2 sharedProfile__avatarImg" 
            />
          ) : (
            <div className="sharedProfile__style2 sharedProfile__avatarPlaceholder">
              {fullName ? fullName.charAt(0) : role?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="sharedProfile__sectionTitle">{fullName || '載入中...'}</h2>
            <p className="sharedProfile__mutedText">{email || '---'}</p>
            <span className="sharedProfile__style3 sharedProfile__roleBadge">
              {role}
            </span>
          </div>
        </div>

        {error && <div className="sharedProfile__style4">{error}</div>}
        {success && <div className="sharedProfile__style5">資料更新成功！</div>}

        <form onSubmit={handleSubmit} className="sharedProfile__page2">
          
          {/* 🌟 透過判斷式，動態決定是一欄還是兩欄的 Grid Layout */}
          <div className={`sharedProfile__formGrid ${role !== 'admin' ? 'sharedProfile__formGrid--2cols' : ''}`}>
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
              <label className="sharedProfile__style6">
                Email Address <span className="sharedProfile__required">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sharedProfile__input"
              />
            </div>
          </div>

          <div>
            <label className="sharedProfile__style6">
              Avatar URL <span className="sharedProfile__required">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://example.com/image.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="sharedProfile__input2"
            />
          </div>

          {role !== 'admin' && (
            <div>
              <label className="sharedProfile__style6">
                Phone Number <span className="sharedProfile__required">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="sharedProfile__input"
              />
            </div>
          )}

          {role === 'buyer' && (
            <div>
              <label className="sharedProfile__style6">
                Shipping Address <span className="sharedProfile__required">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="sharedProfile__input"
              />
            </div>
          )}

          {/* 賣家專屬區塊 */}
          {role === 'seller' && (
            <div className="sharedProfile__companySection">
              <h3 className="sharedProfile__companyTitle">Company Information</h3>
              
              <div className="sharedProfile__formGroup">
                <label className="sharedProfile__style6">
                  Company Name <span className="sharedProfile__required">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="sharedProfile__input"
                />
              </div>

              <div className="sharedProfile__formGrid sharedProfile__formGrid--2cols">
                <div>
                  <label className="sharedProfile__style6">
                    Company Phone <span className="sharedProfile__required">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="sharedProfile__input"
                  />
                </div>

                <div>
                  <label className="sharedProfile__style6">
                    Company Address <span className="sharedProfile__required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="sharedProfile__input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="sharedProfile__submitWrapper">
            <button
              type="submit"
              disabled={loading}
              className="sharedProfile__primaryButton"
            >
              {loading ? '儲存中...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* 危險區域 */}
        {role !== 'admin' && (
          <div className="sharedProfile__dangerZone">
            <h3 className="sharedProfile__dangerTitle">Danger Zone</h3>
            <p className="sharedProfile__dangerDesc">
              帳號刪除後將無法復原，請謹慎操作。
            </p>
            <button
              onClick={() => deleteAccount(userId)}
              disabled={loading || !userId}
              className="sharedProfile__dangerButton"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}