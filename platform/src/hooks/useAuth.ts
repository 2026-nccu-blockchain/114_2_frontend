import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/store/authStore'
import toast from 'react-hot-toast' 
import { authService } from '@/services/authService' 

export type LoginRole = Exclude<UserRole, 'admin' | null>

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
      case '10008': return '密碼強度不足 (長度至少需 6 位數)';
      case '10009': return '登出失敗';
      
      default:
        return defaultMessage || `認證錯誤 (${statusCode})`;
    }
  };

  const login = async (email: string, password: string, role: LoginRole | 'admin') => {
    setLoading(true)
    setError(null)

    try {
      let res: any;
      if (role === 'admin') res = await authService.adminLogin({ email, password });
      else if (role === 'buyer') res = await authService.buyerLogin({ email, password });
      else if (role === 'seller') res = await authService.sellerLogin({ email, password });
      else if (role === 'driver') res = await authService.driverLogin({ email, password });

      const code = res?.data?.status_code;
      if (code === '00000') {
        const token = res.data.token || 'mock_jwt_token_example';
        
        setAuth(token, role);
        toast.success('登入成功！');
        navigate(`/${role}`);
      } else {
        const errorMessage = handleStatusCode(code, res?.data?.message);
        setError(errorMessage);
      }
    } catch (err: any) {
      setError('網路連線失敗，請檢查網路連線後再試');
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
     const response = await authService.buyerRegister(data)

      if (response.data.status_code === '00000') {
        toast.success('帳號註冊成功！請重新登入。')
        navigate('/login') 
      } else {
        const errorMessage = handleStatusCode(response.data.status_code, response?.data?.message)
        setError(errorMessage)
      }
    } catch (err: any) {
      setError('網路連線失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }
  const adminRegister = async (data: AdminRegisterData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.adminRegister(data)

      if (response.data.status_code === '00000') {
        toast.success('管理員帳號建立成功！請重新登入。')
        navigate('/login') 
      } else {
        const errorMessage = handleStatusCode(response.data.status_code, response?.data?.message)
        setError(errorMessage)
      }
    } catch (err: any) {
      setError('網路連線失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return { login, register, adminRegister, loading, error }
}
