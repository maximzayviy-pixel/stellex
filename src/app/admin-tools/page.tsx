'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Code, Headphones, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminTools() {
  const [userEmail, setUserEmail] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdateRole = async () => {
    if (!userEmail) {
      setMessage('Введите email пользователя')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Сначала получаем ID пользователя по email
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (!userResponse.ok) {
        throw new Error('Не удалось получить данные пользователя')
      }

      const userData = await userResponse.json()
      
      // Обновляем роль
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          user_id: userData.user.id,
          role: newRole
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Роль обновлена на ${newRole}`)
        setUserEmail('')
        
        // Если обновили роль текущего пользователя, обновляем токен
        if (userData.user.email === userEmail) {
          const refreshResponse = await fetch('/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            localStorage.setItem('auth_token', refreshData.token)
            setMessage(`✅ Роль обновлена на ${newRole}. Токен обновлен.`)
          }
        }
      } else {
        setMessage(`❌ Ошибка: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating role:', error)
      setMessage(`❌ Ошибка: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const createDefaultAdmin = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/create-default-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setMessage('✅ Администратор по умолчанию создан!')
      } else {
        setMessage(`❌ Ошибка: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      setMessage(`❌ Ошибка: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('auth_token', data.token)
        setMessage('✅ Токен обновлен с актуальной ролью!')
      } else {
        setMessage(`❌ Ошибка: ${data.error}`)
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      setMessage(`❌ Ошибка: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Инструменты администратора</h1>
          </div>

          <div className="space-y-8">
            {/* Создание админа по умолчанию */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Создать администратора по умолчанию</h2>
              </div>
              <p className="text-white/70 mb-4">
                Создает администратора с email: admin@stellex.space и паролем: admin123456
              </p>
              <button
                onClick={createDefaultAdmin}
                disabled={isLoading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Создание...' : 'Создать админа'}
              </button>
            </div>

            {/* Обновление токена */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Обновить токен</h2>
              </div>
              <p className="text-white/70 mb-4">
                Обновляет токен с актуальной ролью из базы данных
              </p>
              <button
                onClick={refreshToken}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Обновление...' : 'Обновить токен'}
              </button>
            </div>

            {/* Обновление роли */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Обновить роль пользователя</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Email пользователя
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Новая роль
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="user">Пользователь</option>
                    <option value="developer">Разработчик</option>
                    <option value="support">Поддержка</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleUpdateRole}
                disabled={isLoading || !userEmail}
                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Обновление...' : 'Обновить роль'}
              </button>
            </div>

            {/* Сообщения */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${
                  message.includes('✅') 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Информация о ролях */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Роли пользователей</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70">user - Обычный пользователь</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">developer - Разработчик</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Headphones className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70">support - Поддержка</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70">admin - Администратор</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
