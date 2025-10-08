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
  Code,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react'
import { User, Developer } from '@/types'
import { useAuth } from './AuthProvider'

interface AdminStats {
  totalUsers: number
  totalCards: number
  totalTransactions: number
  totalRevenue: number
  totalCardBalance: number
  totalDevelopers: number
  totalDeveloperEarnings: number
}

interface UserWithStats extends User {
  cards_count: number
  transactions_count: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCards: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    totalCardBalance: 0,
    totalDevelopers: 0,
    totalDeveloperEarnings: 0
  })
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'developers' | 'settings'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBalanceModal, setShowBalanceModal] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState(0)
  const [balanceType, setBalanceType] = useState<'credit' | 'debit'>('credit')
  const [balanceDescription, setBalanceDescription] = useState('')

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

      console.log('Stats response status:', statsResponse.status)
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        console.log('Stats data:', statsData)
        setStats(statsData.stats)
      } else {
        const errorData = await statsResponse.json()
        console.error('Stats error:', errorData)
      }

      // Загружаем пользователей
      await loadUsers()

    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter })
      })

      const usersResponse = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      console.log('Users response status:', usersResponse.status)

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log('Users data:', usersData)
        setUsers(usersData.users)
      } else {
        const errorData = await usersResponse.json()
        console.error('Users error:', errorData)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleSearch = () => {
    loadUsers()
  }

  const handleCreateUser = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'developer' | 'support'
  }) => {
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        
        // Если создаем разработчика, создаем его профиль
        if (userData.role === 'developer') {
          await fetch('/api/developer/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({
              user_id: data.user.id,
              company_name: '',
              website: '',
              webhook_url: '',
              commission_rate: 0.05
            })
          })
        }
        
        setShowCreateUser(false)
        loadUsers()
        alert('Пользователь успешно создан!')
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Ошибка создания пользователя')
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ userId, updates })
      })

      if (response.ok) {
        loadUsers()
        alert('Пользователь обновлен!')
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Ошибка обновления пользователя')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        loadUsers()
        alert('Пользователь удален!')
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Ошибка удаления пользователя')
    }
  }

  const handleBalanceChange = async () => {
    if (!selectedUser || !balanceAmount) return

    try {
      const response = await fetch('/api/admin/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: balanceAmount,
          type: balanceType,
          description: balanceDescription
        })
      })

      if (response.ok) {
        setShowBalanceModal(false)
        setSelectedUser(null)
        setBalanceAmount(0)
        setBalanceDescription('')
        loadUsers()
        alert('Баланс успешно изменен!')
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error changing balance:', error)
      alert('Ошибка изменения баланса')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка админки...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="p-4 pt-12 pb-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Админ панель</h1>
            <p className="text-white/70">Управление системой Stellex Pay</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={loadAdminData}
              className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Обзор', icon: BarChart3 },
            { id: 'users', label: 'Пользователи', icon: Users },
            { id: 'developers', label: 'Разработчики', icon: Code },
            { id: 'settings', label: 'Настройки', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-purple-900'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Пользователи</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Карты</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCards}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Транзакции</p>
                    <p className="text-3xl font-bold text-white">{stats.totalTransactions}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Общий баланс</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCardBalance.toFixed(2)}</p>
                    <p className="text-white/50 text-xs">STARS</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Разработчики</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Всего разработчиков:</span>
                    <span className="text-white font-semibold">{stats.totalDevelopers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Общий заработок:</span>
                    <span className="text-white font-semibold">{stats.totalDeveloperEarnings.toFixed(2)} STARS</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Финансы</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Общий оборот:</span>
                    <span className="text-white font-semibold">{stats.totalRevenue.toFixed(2)} STARS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Средний баланс:</span>
                    <span className="text-white font-semibold">
                      {stats.totalCards > 0 ? (stats.totalCardBalance / stats.totalCards).toFixed(2) : '0'} STARS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Поиск пользователей..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Все роли</option>
                    <option value="user">Пользователи</option>
                    <option value="developer">Разработчики</option>
                    <option value="support">Поддержка</option>
                    <option value="admin">Админы</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    Поиск
                  </button>
                  <button
                    onClick={() => setShowCreateUser(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Создать</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Пользователь</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Роль</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Карты</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Транзакции</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Дата регистрации</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user?.first_name || 'N/A'} {user?.last_name || ''}
                            </div>
                            <div className="text-sm text-white/50">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'developer' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'support' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {user.cards_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {user.transactions_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                          {new Date(user.created_at).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowBalanceModal(true)
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title="Изменить баланс"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateUser(user.id, { role: user.role === 'user' ? 'developer' : 'user' })}
                              className="text-yellow-400 hover:text-yellow-300"
                              title="Изменить роль"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Balance Modal */}
        {showBalanceModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Изменить баланс: {selectedUser.first_name} {selectedUser.last_name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Тип операции</label>
                  <select
                    value={balanceType}
                    onChange={(e) => setBalanceType(e.target.value as 'credit' | 'debit')}
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="credit">Пополнить</option>
                    <option value="debit">Списать</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Сумма (STARS)</label>
                  <input
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Введите сумму"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Описание</label>
                  <input
                    type="text"
                    value={balanceDescription}
                    onChange={(e) => setBalanceDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Описание операции"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleBalanceChange}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all"
                >
                  Применить
                </button>
                <button
                  onClick={() => {
                    setShowBalanceModal(false)
                    setSelectedUser(null)
                    setBalanceAmount(0)
                    setBalanceDescription('')
                  }}
                  className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateUser && (
          <CreateUserModal
            onClose={() => setShowCreateUser(false)}
            onSubmit={handleCreateUser}
          />
        )}
      </div>
    </div>
  )
}

// Компонент для создания пользователя
function CreateUserModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'developer' | 'support'
  }) => void
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'developer' as 'developer' | 'support'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Создать пользователя</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Имя</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Фамилия</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Роль</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'developer' | 'support' })}
              className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="developer">Разработчик</option>
              <option value="support">Поддержка</option>
            </select>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all"
            >
              Создать
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
