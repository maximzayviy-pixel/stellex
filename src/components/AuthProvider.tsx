'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { getTelegramWebAppData } from '@/lib/telegramUtils'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем токен в localStorage
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Валидируем токен и загружаем пользователя
      validateToken(token)
    } else {
      // Пытаемся получить данные из Telegram Web App
      const tgUser = getTelegramWebAppData()
      if (tgUser) {
        // Авторизуемся через Telegram
        authenticateWithTelegram(tgUser)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const authenticateWithTelegram = async (tgUser: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string; is_premium?: boolean }) => {
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tgUser)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
          localStorage.setItem('auth_token', data.token)
        }
      }
    } catch (error) {
      console.error('Telegram auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = (token: string) => {
    localStorage.setItem('auth_token', token)
    validateToken(token)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
