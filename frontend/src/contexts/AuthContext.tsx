import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  country: string
  phone?: string
  role: string
  kyc_status: string
  is_active: boolean
  balance: number
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  token: string | null
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  country: string
  phone?: string
  referral_code?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`)
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      const { access_token } = response.data
      setToken(access_token)
      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      await fetchUser()
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      
      const { access_token } = response.data
      setToken(access_token)
      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      await fetchUser()
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
