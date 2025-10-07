'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Settings, 
  Plus,
  Shield,
  BarChart3,
  UserPlus,
  Code
} from 'lucide-react'
import { User, Developer } from '@/types'
import { useAuth } from './AuthProvider'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
    totalTransactions: 0,
    totalRevenue: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'developers' | 'settings'>('overview')

  useEffect(() => {
    if (user) {
      loadAdminData()
    }
  }, [user])

  const loadAdminData = async () => {
    try {
      setIsLoading(true)
      
      // Загружаем статистику
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Загружаем пользователей
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users)
      }

      // Загружаем разработчиков
      const developersResponse = await fetch('/api/admin/developers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (developersResponse.ok) {
        const developersData = await developersResponse.json()
        setDevelopers(developersData.developers)
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDeveloper = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/create-developer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ user_id: userId })
      })

      if (response.ok) {
        await loadAdminData()
        alert('Разработчик создан успешно!')
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка создания разработчика')
      }
    } catch (error) {
      console.error('Error creating developer:', error)
      alert('Ошибка создания разработчика')
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        await loadAdminData()
        alert('Роль пользователя обновлена!')
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка обновления роли')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Ошибка обновления роли')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Доступ запрещен</h1>
          <p className="text-white/70">У вас нет прав администратора</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Stellex Admin</h1>
            <p className="text-white/70">Панель администратора</p>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-white/70" />
            <span className="text-white/70 text-sm">Администратор</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white/70 text-sm">Пользователи</p>
                <p className="text-white text-xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white/70 text-sm">Карты</p>
                <p className="text-white text-xl font-bold">{stats.totalCards}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white/70 text-sm">Транзакции</p>
                <p className="text-white text-xl font-bold">{stats.totalTransactions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-white/70 text-sm">Доход</p>
                <p className="text-white text-xl font-bold">{stats.totalRevenue.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6">
          {[
            { id: 'overview', label: 'Обзор', icon: BarChart3 },
            { id: 'users', label: 'Пользователи', icon: Users },
            { id: 'developers', label: 'Разработчики', icon: Code },
            { id: 'settings', label: 'Настройки', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'developers' | 'settings')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-20">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Системная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium mb-2">Активные пользователи</h4>
                  <p className="text-white/70 text-sm">За последние 24 часа: {Math.floor(stats.totalUsers * 0.1)}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium mb-2">Средний баланс карты</h4>
                  <p className="text-white/70 text-sm">
                    {stats.totalCards > 0 ? Math.floor(stats.totalRevenue / stats.totalCards) : 0} ₽
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Пользователи</h3>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <UserPlus className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.first_name.charAt(0)}{user.last_name?.charAt(0) || ''}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {user.first_name} {user.last_name || ''}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {user.email || `ID: ${user.telegram_id}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="user">Пользователь</option>
                        <option value="developer">Разработчик</option>
                        <option value="support">Поддержка</option>
                        <option value="admin">Администратор</option>
                      </select>
                      {user.role === 'user' && (
                        <button
                          onClick={() => handleCreateDeveloper(user.id)}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                          title="Создать разработчика"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'developers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Разработчики</h3>
            </div>
            
            <div className="space-y-3">
              {developers.map((developer) => (
                <div key={developer.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{developer.company_name}</h4>
                      <p className="text-white/70 text-sm">
                        API ключ: {developer.api_key.slice(0, 8)}...
                      </p>
                      <p className="text-white/70 text-sm">
                        Комиссия: {developer.commission_rate}%
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        developer.is_active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {developer.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Системные настройки</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Комиссия по умолчанию</label>
                  <input
                    type="number"
                    defaultValue="2.5"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Лимит карт на пользователя</label>
                  <input
                    type="number"
                    defaultValue="3"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Курс звезд (звезд за рубль)</label>
                  <input
                    type="number"
                    defaultValue="2"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  Сохранить настройки
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
