'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { getTelegramWebAppData, isTelegramWebApp, waitForTelegramWebApp } from '@/lib/telegramUtils'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'
import LoadingError from './LoadingError'
import LoginScreen from './LoginScreen'
import WebLoginForm from './WebLoginForm'
import TelegramInstructions from './TelegramInstructions'

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
  const [error, setError] = useState<string | null>(null)
  const [showLoginScreen, setShowLoginScreen] = useState(false)
  const [showWebLogin, setShowWebLogin] = useState(false)
  const [showTelegramInstructions, setShowTelegramInstructions] = useState(false)
  
  // Используем хук для Telegram WebApp
  const { isTelegramWebApp, isReady, user: tgUser, webApp } = useTelegramWebApp()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        
        // Проверяем токен в localStorage
        const token = localStorage.getItem('auth_token')
        if (token) {
          console.log('Found token, validating...')
          // Валидируем токен и загружаем пользователя
          await validateToken(token)
        } else {
          console.log('No token found, checking Telegram Web App...')
          
          // Проверяем Telegram WebApp
          if (isTelegramWebApp) {
            if (isReady && tgUser) {
              console.log('In Telegram Web App with user data, authenticating...', tgUser)
              // Авторизуемся через Telegram
              await authenticateWithTelegram(tgUser)
            } else if (isReady && !tgUser) {
              // Telegram WebApp готов, но нет данных пользователя - показываем инструкции
              console.log('Telegram WebApp ready but no user data, showing instructions')
              setShowTelegramInstructions(true)
              setLoading(false)
            } else {
              // Telegram WebApp найден, но не готов - ждем
              console.log('Telegram WebApp found but not ready, waiting...')
              return // Не устанавливаем loading = false, продолжаем ждать
            }
          } else {
            console.log('Not in Telegram Web App, showing web login form')
            setShowWebLogin(true)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setError('Ошибка инициализации аутентификации')
        setLoading(false)
      }
    }

    // Запускаем инициализацию только когда Telegram WebApp готов или определенно недоступен
    if (isReady || !isTelegramWebApp) {
      initializeAuth()
    }
  }, [isTelegramWebApp, isReady, tgUser])

  // Добавляем таймаут для предотвращения бесконечной загрузки
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth initialization timeout, showing web login form')
        setShowWebLogin(true)
        setLoading(false)
      }
    }, 10000) // 10 секунд таймаут

    return () => clearTimeout(timeoutId)
  }, [loading])

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
        setError(null)
      } else {
        localStorage.removeItem('auth_token')
        setError('Сессия истекла. Войдите снова.')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('auth_token')
      setError('Ошибка проверки токена')
    } finally {
      setLoading(false)
    }
  }

         const authenticateWithTelegram = async (tgUser: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string; is_premium?: boolean }) => {
           try {
             console.log('Sending Telegram user data to API:', tgUser)
             
             const response = await fetch('/api/auth/telegram', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify(tgUser)
             })

             console.log('API response status:', response.status)
             
             if (response.ok) {
               const data = await response.json()
               console.log('API response data:', data)
               
               if (data.success) {
                 setUser(data.user)
                 localStorage.setItem('auth_token', data.token)
                 setError(null)
               } else {
                 console.error('API returned error:', data.error)
                 setError(data.error || 'Ошибка авторизации через Telegram')
               }
             } else {
               const errorData = await response.json().catch(() => ({}))
               console.error('API request failed:', response.status, errorData)
               setError(errorData.error || 'Ошибка подключения к серверу')
             }
           } catch (error) {
             console.error('Telegram auth error:', error)
             setError('Ошибка авторизации через Telegram')
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

  const retryAuth = () => {
    setError(null)
    setShowLoginScreen(false)
    setShowWebLogin(false)
    setShowTelegramInstructions(false)
    setLoading(true)
    // Повторяем инициализацию
    const token = localStorage.getItem('auth_token')
    if (token) {
      validateToken(token)
    } else {
      if (isTelegramWebApp && isReady) {
        if (tgUser) {
          authenticateWithTelegram(tgUser)
        } else {
          setShowWebLogin(true)
          setLoading(false)
        }
      } else if (webApp && !isReady) {
        setShowTelegramInstructions(true)
        setLoading(false)
      } else {
        setShowWebLogin(true)
        setLoading(false)
      }
    }
  }

  const handleWebLogin = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem('auth_token', data.token)
        setShowWebLogin(false)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Web login error:', error)
      setError('Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  const handleWebRegister = async (email: string, password: string, firstName: string, lastName?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, firstName, lastName })
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem('auth_token', data.token)
        setShowWebLogin(false)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Web registration error:', error)
      setError('Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkTelegram = async () => {
    try {
      if (!isTelegramWebApp || !isReady) {
        setError('Эта функция доступна только в Telegram WebApp')
        return
      }

      if (!tgUser) {
        setError('Не удалось получить данные Telegram. Убедитесь, что вы открыли приложение через бота @stellexbank_bot')
        return
      }

      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Необходимо войти в аккаунт')
        return
      }

      console.log('Linking Telegram user:', tgUser)

      const response = await fetch('/api/auth/link-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tgUser)
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setShowWebLogin(false)
        setError(null)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Link Telegram error:', error)
      setError('Ошибка привязки Telegram')
    }
  }

  // Показываем ошибку, если она есть
  if (error) {
    return <LoadingError message={error} onRetry={retryAuth} />
  }

  // Показываем экран входа, если не в Telegram Web App
  if (showLoginScreen) {
    return <LoginScreen onRetry={retryAuth} />
  }

  // Показываем инструкции по правильному открытию Telegram WebApp
  if (showTelegramInstructions) {
    return <TelegramInstructions onRetry={retryAuth} />
  }

  // Показываем веб-форму входа/регистрации
  if (showWebLogin) {
    return (
      <WebLoginForm
        onLogin={handleWebLogin}
        onRegister={handleWebRegister}
        onLinkTelegram={handleLinkTelegram}
        loading={loading}
        error={error}
      />
    )
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