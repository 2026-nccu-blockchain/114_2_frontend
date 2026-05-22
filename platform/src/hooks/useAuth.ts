import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/store/authStore'

export type LoginRole = Exclude<UserRole, 'admin' | null>

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

  const register = async (_fullName: string, _email: string, _password: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const mockToken = 'mock_jwt_token_example'

      setAuth(mockToken, 'buyer')
      navigate('/buyer')
    } catch (err: any) {
      setError(err.response?.data?.message || '註冊失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return { login, register, loading, error }
}
