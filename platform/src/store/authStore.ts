import { create } from 'zustand'
import Cookies from 'js-cookie'

export type UserRole = 'buyer' | 'seller' | 'admin' | 'driver' | null

interface AuthState {
  token: string | null
  role: UserRole
  setAuth: (token: string, role: UserRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get('token') || null,
  role: (Cookies.get('role') as UserRole) || null,

  setAuth: (token, role) => {
    const cookieOptions: Cookies.CookieAttributes = {
      expires: 7,
      secure: true,
      sameSite: 'strict',
    }

    Cookies.set('token', token, cookieOptions)
    if (role) {
      Cookies.set('role', role, cookieOptions)
    }

    set({ token, role })
  },

  logout: () => {
    Cookies.remove('token')
    Cookies.remove('role')
    set({ token: null, role: null })
  },
}))
