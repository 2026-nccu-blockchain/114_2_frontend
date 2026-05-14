import { useState } from 'react';

interface UpdateProfileData {
  fullName: string;
  phone: string;
  avatarUrl: string;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!data.fullName.trim()) {
        throw new Error('姓名不能為空白');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '儲存失敗，請確認網路連線');
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error, success };
};
