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

  const login = async (_email: string, _password: string, role: LoginRole) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockToken = 'mock_jwt_token_example'
      setAuth(mockToken, role)
      navigate(`/${role}`)
    } catch (err: any) {
      setError(err.response?.data?.message || '登入失敗，請檢查帳號密碼')
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
        toast.success('Account created successfully! Please sign in.')
        navigate('/login') 
      } else if (response.data.status_code === '10006') {
        setError('account already exists.')
      } else {
        setError(response.data.message || 'Registration failed')
      }
    } catch (err: any) {
      setError('Network error. Please try again later.')
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
        toast.success('Admin account created successfully! Please sign in.')
        navigate('/login') 
      } else if (response.data.status_code === '10006') {
        setError('This email is already registered. Please log in.')
      } else {
        setError(response.data.message || 'Registration failed')
      }
    } catch (err: any) {
      setError('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return { login, register, adminRegister, loading, error }
}
