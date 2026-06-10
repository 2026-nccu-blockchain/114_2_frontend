import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/store/authStore'
import toast from 'react-hot-toast' 
import { authService, type AuthResponse, type LoginRequest } from '@/services/authService' 
import type { ApiError } from '@/types/common'

export type LoginRole = Exclude<UserRole, 'admin' | null>
type LoginAttemptRole = Exclude<UserRole, null>

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

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const handleStatusCode = (statusCode: string, defaultMessage: string) => {
    switch (statusCode) {
      case '00000': return null;
      case '00001': return '操作失敗，請稍後再試';
      case '00002': return '輸入欄位格式錯誤';
      case '00005': return '請求的資源不存在';
      case '00006': return '系統伺服器錯誤，請聯絡系統管理員';
      
      case '10001': return '該使用者帳號不存在';
      case '10002': return '密碼輸入錯誤，請重新確認';
      case '10003': return '帳號或密碼錯誤，登入失敗';
      case '10006': return '此 Email 帳號已被註冊';
      case '10007': return 'Email 格式不正確';
      case '10008': return '權限不足';
      case '10009': return '手機格式不正確';
      case '10010': return '密碼強度不足';
      
      default:
        return defaultMessage || `認證錯誤 (${statusCode})`;
    }
  };

  const getErrorMessage = (err: unknown, fallback: string) => {
    const apiError = err as ApiError;
    if (apiError?.statusCode) return handleStatusCode(apiError.statusCode, apiError.message) ?? fallback;
    if (apiError?.message) return apiError.message;
    return fallback;
  };

  const loginServices: Record<LoginAttemptRole, (data: LoginRequest) => Promise<{ data: AuthResponse }>> = {
    buyer: authService.buyerLogin,
    seller: authService.sellerLogin,
    driver: authService.driverLogin,
    admin: authService.adminLogin,
  };

  const getLoginAttemptOrder = (emailValue: string, preferredRole?: LoginAttemptRole): LoginAttemptRole[] => {
    if (preferredRole) return [preferredRole];
    if (emailValue.includes('seller')) return ['seller', 'buyer', 'driver', 'admin'];
    if (emailValue.includes('driver')) return ['driver', 'buyer', 'seller', 'admin'];
    if (emailValue.includes('admin')) return ['admin', 'buyer', 'seller', 'driver'];
    return ['buyer', 'seller', 'driver', 'admin'];
  };

  const login = async (email: string, password: string, role?: LoginRole | 'admin') => {
    setLoading(true)
    setError(null)

    let lastError = '帳號或密碼錯誤，登入失敗';

    try {
      const payload = { email, password };
      const attemptRoles = getLoginAttemptOrder(email, role);

      for (const attemptRole of attemptRoles) {
        try {
          const response = await loginServices[attemptRole](payload);
          const responsePayload = response.data;
          const code = responsePayload.status_code;

          if (code === '00000' && responsePayload.token) {
            setAuth(responsePayload.token, attemptRole);
            toast.success('登入成功！');
            navigate('/');
            return;
          }

          lastError = handleStatusCode(code, responsePayload.message) || lastError;
        } catch (err) {
          lastError = getErrorMessage(err, lastError);
        }
      }

      setError(lastError);
    } catch (err) {
      console.error(err)
      setError(getErrorMessage(err, '網路連線失敗，請檢查網路連線後再試'))
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
     const response = await authService.buyerRegister(data)
     const responsePayload = response?.data ?? response;
     const code = responsePayload?.status_code;
      if (code === '00000') {
        toast.success('帳號註冊成功！請重新登入。')
        navigate('/login') 
      } else {
        const errorMessage = handleStatusCode(code, responsePayload?.message)
        setError(errorMessage)
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請稍後再試'))
    } finally {
      setLoading(false)
    }
  }
  const adminRegister = async (data: AdminRegisterData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.adminRegister(data)
      const responsePayload = response?.data ?? response;
      const code = responsePayload?.status_code;

      if (code === '00000') {
        toast.success('管理員帳號建立成功！請重新登入。')
        navigate('/login') 
      } else {
        const errorMessage = handleStatusCode(code, responsePayload?.message)
        setError(errorMessage)
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '網路連線失敗，請稍後再試'))
    } finally {
      setLoading(false)
    }
  }

  return { login, register, adminRegister, loading, error }
}
