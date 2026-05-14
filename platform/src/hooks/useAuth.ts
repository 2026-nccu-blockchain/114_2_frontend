import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/store/authStore'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      let role: UserRole = 'buyer'
      if (email.includes('admin')) role = 'admin'
      else if (email.includes('seller')) role = 'seller'
      else if (email.includes('driver')) role = 'driver'

      const mockToken = 'mock_jwt_token_example'
      setAuth(mockToken, role)
      navigate(`/${role}`)
    } catch (err: any) {
      setError(err.response?.data?.message || '登入失敗，請檢查帳號密碼')
    } finally {
      setLoading(false)
    }
  }

  const register = async (fullName: string, email: string, password: string) => {
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
