import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore, type UserRole } from '@/store/authStore';
import type { ApiError } from '@/types/common';

export type LoginRole = Exclude<UserRole, null>;

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface AdminRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface SellerRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  company_address: string;
  company_phone: string;
  company_name: string;
}

export interface DriverRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const getPasswordValidationError = (password: string) => {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.';
  if (!/\d/.test(password)) return 'Password must include a number.';
  return '';
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { role, token, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleStatusCode = (statusCode: string | undefined, defaultMessage = '') => {
    switch (statusCode) {
      case '00000': return null;
      case '00001': return '操作失敗，請稍後再試';
      case '00002': return '輸入欄位格式錯誤';
      case '00003': return '尚未登入';
      case '00004': return '無權限執行此操作';
      case '00005': return '請求的資源不存在';
      case '00006': return '系統伺服器錯誤，請聯絡系統管理員';
      case '10001': return '該使用者帳號不存在';
      case '10002': return '密碼輸入錯誤，請重新確認';
      case '10003': return '帳號或密碼錯誤，登入失敗';
      case '10004': return '登入憑證無效，請重新登入';
      case '10005': return '登入已過期，請重新登入';
      case '10006': return '此 Email 帳號已被註冊';
      case '10007': return 'Email 格式不正確';
      case '10008': return '權限不足';
      case '10009': return '手機格式不正確';
      case '10010': return '密碼強度不足';
      default:
        return defaultMessage || `認證錯誤 (${statusCode || 'unknown'})`;
    }
  };

  const getErrorMessage = (err: unknown, fallback: string) => {
    const apiError = err as ApiError;
    if (apiError?.statusCode) return handleStatusCode(apiError.statusCode, apiError.message) ?? fallback;
    if (apiError?.message) return apiError.message;
    return fallback;
  };

  const loginServices = {
    buyer: authService.buyerLogin,
    seller: authService.sellerLogin,
    driver: authService.driverLogin,
    admin: authService.adminLogin,
  } satisfies Record<LoginRole, typeof authService.buyerLogin>;

  const login = async (email: string, password: string, loginRole: LoginRole = 'buyer') => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginServices[loginRole]({ email, password });
      const responsePayload = response.data;
      const errorMessage = handleStatusCode(responsePayload.status_code, responsePayload.message);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      if (!responsePayload.token) {
        setError('登入回應缺少 token，請聯絡後端確認');
        return;
      }

      setAuth(responsePayload.token, loginRole);
      toast.success('登入成功！');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請檢查網路連線後再試'));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.buyerRegister(data);
      const responsePayload = response.data;
      const errorMessage = handleStatusCode(responsePayload.status_code, responsePayload.message);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      toast.success('帳號註冊成功！請重新登入。');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  const adminRegister = async (data: AdminRegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.adminRegister(data);
      const responsePayload = response.data;
      const errorMessage = handleStatusCode(responsePayload.status_code, responsePayload.message);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      toast.success('管理員帳號建立成功！請重新登入。');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  const sellerRegister = async (data: SellerRegisterData) => {
    setLoading(true);
    setError(null);

    if (!token || role !== 'admin') {
      setError('請先以管理員身分登入');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.sellerRegister(data, token);
      const responsePayload = response.data;
      const errorMessage = handleStatusCode(responsePayload.status_code, responsePayload.message);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      toast.success('賣家帳號建立成功！');
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  const driverRegister = async (data: DriverRegisterData) => {
    setLoading(true);
    setError(null);

    if (!token || role !== 'admin') {
      setError('請先以管理員身分登入');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.driverRegister(data, token);
      const responsePayload = response.data;
      const errorMessage = handleStatusCode(responsePayload.status_code, responsePayload.message);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      toast.success('司機帳號建立成功！');
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請稍後再試'));
    } finally {
      setLoading(false);
    }
  };

  return { login, register, adminRegister, sellerRegister, driverRegister, loading, error };
};
