import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export interface UpdateProfileData {
  email?: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  company_address?: string;
  company_phone?: string;
  company_name?: string;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { role, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleStatusCode = (statusCode: string, defaultMessage: string) => {
    switch (statusCode) {
      case '00000': return null;
      case '00001': return '操作失敗，請稍後再試';
      case '00002': return '輸入欄位格式錯誤';
      case '00003': 
      case '00004': 
      case '10004':
      case '10005': 
        toast.error('登入已過期或無權限，請重新登入');
        logout();
        navigate('/login');
        return '登入已過期或無權限';

      case '00005': return '請求的資源不存在';
      case '00006': return '系統伺服器錯誤，請聯絡系統管理員';
      case '10001': return '該使用者帳號不存在';
      case '10002': return '密碼輸入錯誤，請重新確認';
      case '10003': return '帳號或密碼錯誤，登入失敗';
      case '10006': return '此 Email 帳號已被註冊';
      case '10007': return 'Email 格式不正確';
      case '10008': return '密碼強度不足 (長度至少需 6 位數)';
      case '10009': return '登出失敗';
      
      default:
        return defaultMessage || `認證錯誤 (${statusCode})`;
    }
  };

  const fetchProfile = async () => {
    if (!token || !role) return null;
    
    setLoading(true);
    setError(null);
    try {
      let res: any;
      if (role === 'admin') res = await userService.getAdmin(token);
      else if (role === 'buyer') res = await userService.getBuyer(token);
      else if (role === 'seller') res = await userService.getSeller(token);
      else if (role === 'driver') res = await userService.getDriver(token);

      const code = res?.data?.status_code;
      if (code === '00000') {
        return res.data;
      } else {
        const errorMessage = handleStatusCode(code, res?.data?.message);
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      setError('網路連線失敗，請檢查網路連線後再試');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!token || !role) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!data.name || !data.name.trim()) {
        setError('姓名不能為空白');
        setLoading(false);
        return;
      }
      if (!data.email || !data.email.trim()) {
        setError('Email 不能為空白');
        setLoading(false);
        return;
      }

      let res: any;
      if (role === 'admin') res = await userService.updateAdmin(data, token);
      else if (role === 'buyer') res = await userService.updateBuyer(data, token);
      else if (role === 'seller') res = await userService.updateSeller(data, token);
      else if (role === 'driver') res = await userService.updateDriver(data, token);

      const code = res?.data?.status_code;
      if (code === '00000') {
        setSuccess(true);
        toast.success('資料更新成功！');
      } else {
        const errorMessage = handleStatusCode(code, res?.data?.message);
        setError(errorMessage);
      }
    } catch (err: any) {
      setError('網路連線失敗，請檢查網路連線後再試');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (targetId: string) => {
    if (!token || !role || role === 'admin') return; 
    
    if (!window.confirm('確定要註銷並永久刪除您的帳號嗎？此動作將無法復原。')) return;

    setLoading(true);
    try {
      let res: any;
      if (role === 'buyer') res = await userService.deleteBuyer(targetId, token);
      else if (role === 'seller') res = await userService.deleteSeller(targetId, token);
      else if (role === 'driver') res = await userService.deleteDriver(targetId, token);

      const code = res?.data?.status_code;
      if (code === '00000') {
        toast.success('帳號註銷成功！');
        logout(); 
        navigate('/login'); 
      } else {
        const errorMessage = handleStatusCode(code, res?.data?.message);
        toast.error(errorMessage || '帳號註銷失敗');
      }
    } catch (err: any) {
      toast.error('網路連線失敗，請檢查網路連線後再試');
    } finally {
      setLoading(false);
    }
  };

  return { fetchProfile, updateProfile, deleteAccount, loading, error, success };
};