'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'

interface User {
  id: string
  username: string
  balance: number
}

interface AuthContextType {
  user: User | null
  login: (username: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('casino-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('casino-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      balance: 10000 // Starting balance
    }
    
    setUser(newUser)
    localStorage.setItem('casino-user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('casino-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
