'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Link, 
  Copy, 
  Eye, 
  EyeOff,
  Plus,
  ExternalLink,
  Webhook,
  DollarSign,
  Play,
  Zap
} from 'lucide-react'
import { Developer, PaymentRequest } from '@/types'
import { useAuth } from './AuthProvider'
import ButtonGenerator from './ButtonGenerator'
import DeveloperSandbox from './DeveloperSandbox'
import DeveloperDocs from './DeveloperDocs'

export default function DeveloperDashboard() {
  const { user } = useAuth()
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'settings' | 'docs' | 'button-generator' | 'sandbox'>('overview')
  const [showButtonGenerator, setShowButtonGenerator] = useState(false)
  const [showSandbox, setShowSandbox] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [payments, setPayments] = useState([])
  const [paymentStats, setPaymentStats] = useState({
    total_payments: 0,
    completed_payments: 0,
    total_amount: 0,
    pending_amount: 0,
    success_rate: 0
  })

  useEffect(() => {
    if (user) {
      loadDeveloperData()
    }
  }, [user])

  const loadDeveloperData = async () => {
    try {
      setIsLoading(true)
      
      // Если пользователь админ, создаем виртуальный профиль разработчика
      if (user?.role === 'admin') {
        const adminDeveloper: Developer = {
          id: user.id,
          user_id: user.id,
          api_key: 'admin_access',
          company_name: 'Stellex Admin',
          website: 'https://stellex.space',
          description: 'Администратор системы',
          is_active: true,
          total_earnings: 0,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
        setDeveloper(adminDeveloper)
        setPaymentRequests([])
        setIsLoading(false)
        return
      }
      
      // Загружаем данные разработчика
      const response = await fetch('/api/developer/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDeveloper(data.developer)
        setPaymentRequests(data.paymentRequests || [])
      }
    } catch (error) {
      console.error('Error loading developer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyApiKey = async () => {
    if (developer?.api_key) {
      try {
        await navigator.clipboard.writeText(developer.api_key)
        alert('API ключ скопирован!')
      } catch (error) {
        console.error('Failed to copy API key:', error)
      }
    }
  }

  const handleGenerateApiKey = async () => {
    try {
      const response = await fetch('/api/developer/generate-api-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (data.success) {
        // Обновляем API ключ в состоянии
        setDeveloper(prev => prev ? { ...prev, api_key: data.apiKey } : null)
        alert('Новый API ключ сгенерирован!')
      } else {
        alert(`Ошибка: ${data.error}`)
      }
    } catch (error) {
      console.error('Error generating API key:', error)
      alert('Ошибка генерации API ключа')
    }
  }

  const loadPayments = async () => {
    if (!developer?.api_key) return

    try {
      const response = await fetch('/api/developer/payments', {
        headers: {
          'Authorization': `Bearer ${developer.api_key}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
        setPaymentStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    }
  }

  const generatePaymentButton = () => {
    const buttonCode = `<button onclick="openStellexPay('${developer?.api_key}', 100, 'Тестовый платеж')">
  ОПЛАТИТЬ С ПОМОЩЬЮ STELLEX PAY
</button>

<script>
function openStellexPay(apiKey, amount, description) {
  const paymentUrl = '${window.location.origin}/pay?api_key=' + apiKey + '&amount=' + amount + '&description=' + encodeURIComponent(description);
  window.open(paymentUrl, '_blank', 'width=400,height=600');
}
</script>`
    
    navigator.clipboard.writeText(buttonCode)
    alert('Код кнопки скопирован!')
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

  if (!developer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Доступ запрещен</h1>
          <p className="text-white/70">У вас нет прав разработчика</p>
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
            <h1 className="text-2xl font-bold text-white">Stellex Developer</h1>
            <p className="text-white/70">Панель разработчика</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-white/70 text-sm">
              {developer.company_name}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white/70 text-sm">Общий доход</p>
                <p className="text-white text-xl font-bold">0 ₽</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white/70 text-sm">Платежей</p>
                <p className="text-white text-xl font-bold">{paymentRequests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white/70 text-sm">Комиссия</p>
                <p className="text-white text-xl font-bold">{developer.commission_rate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6">
          {[
            { id: 'overview', label: 'Обзор', icon: BarChart3 },
            { id: 'payments', label: 'Платежи', icon: CreditCard },
            { id: 'button-generator', label: 'Генератор кнопок', icon: Zap },
            { id: 'sandbox', label: 'Песочница', icon: Play },
            { id: 'settings', label: 'Настройки', icon: Settings },
            { id: 'docs', label: 'Документация', icon: Code }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'payments' | 'settings' | 'docs')}
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
            {/* API Key */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">API Ключ</h3>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-black/20 rounded-lg p-3 font-mono text-sm text-white/70">
                  {showApiKey ? developer.api_key : '••••••••••••••••••••••••••••••••'}
                </div>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                </button>
                <button
                  onClick={handleCopyApiKey}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleGenerateApiKey}
                  className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white text-sm font-medium"
                >
                  Новый ключ
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePaymentButton}
                className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Link className="w-5 h-5" />
                <span>Генератор кнопки</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('docs')}
                className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Code className="w-5 h-5" />
                <span>API Документация</span>
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Платежи</h3>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {paymentRequests.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">Платежей пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentRequests.map((request) => (
                  <div key={request.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{request.description}</p>
                        <p className="text-white/70 text-sm">{request.amount} ₽</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {request.status === 'completed' ? 'Завершен' :
                         request.status === 'pending' ? 'Ожидает' : 'Отклонен'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'button-generator' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-bold text-xl mb-2">Генератор кнопок Stellex Pay</h3>
              <p className="text-white/70">Создайте и настройте кнопки оплаты для вашего сайта</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Быстрый старт
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowButtonGenerator(true)}
                    className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Создать кнопку</span>
                  </button>
                  <p className="text-white/70 text-sm text-center">
                    Настройте внешний вид и получите готовый код
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Статистика платежей
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Всего платежей:</span>
                    <span className="text-white font-semibold">{paymentStats.total_payments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Завершено:</span>
                    <span className="text-green-400 font-semibold">{paymentStats.completed_payments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Общая сумма:</span>
                    <span className="text-white font-semibold">{paymentStats.total_amount} STARS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Успешность:</span>
                    <span className="text-blue-400 font-semibold">{paymentStats.success_rate}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4">Последние платежи</h4>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">Платежей пока нет</p>
                  <p className="text-white/50 text-sm mt-2">Создайте кнопку и начните принимать платежи</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{payment.description}</p>
                        <p className="text-white/70 text-sm">{payment.amount} STARS</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {payment.status === 'completed' ? 'Завершен' :
                         payment.status === 'pending' ? 'Ожидает' : 'Отклонен'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-bold text-xl mb-2">Песочница для тестирования API</h3>
              <p className="text-white/70">Тестируйте API запросы прямо в браузере</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Быстрые тесты
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSandbox(true)}
                    className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Открыть песочницу</span>
                  </button>
                  <p className="text-white/70 text-sm text-center">
                    Тестируйте API запросы с вашим ключом
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Документация
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowDocs(true)}
                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Code className="w-5 h-5" />
                    <span>Открыть документацию</span>
                  </button>
                  <p className="text-white/70 text-sm text-center">
                    Полное руководство по API
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4">Примеры использования</h4>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Создание платежа</h5>
                  <code className="text-green-400 text-sm block">
                    POST /api/developer/payment<br/>
                    Authorization: Bearer {developer?.api_key?.slice(0, 20)}...<br/>
                    {JSON.stringify({ amount: 100, description: "Тестовый платеж" }, null, 2)}
                  </code>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Получение статистики</h5>
                  <code className="text-blue-400 text-sm block">
                    GET /api/developer/payments<br/>
                    Authorization: Bearer {developer?.api_key?.slice(0, 20)}...
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Настройки профиля</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Название компании</label>
                  <input
                    type="text"
                    value={developer.company_name}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Веб-сайт</label>
                  <input
                    type="text"
                    value={developer.website || ''}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Webhook URL</label>
                  <input
                    type="text"
                    value={developer.webhook_url || ''}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Комиссия</label>
                  <input
                    type="text"
                    value={`${developer.commission_rate}%`}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">API Документация</h3>
              <div className="space-y-4 text-white/70">
                <div>
                  <h4 className="text-white font-medium mb-2">Базовый URL</h4>
                  <code className="bg-black/20 px-3 py-2 rounded text-sm">
                    {window.location.origin}/api
                  </code>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Аутентификация</h4>
                  <p className="text-sm">Используйте ваш API ключ в заголовке Authorization:</p>
                  <code className="bg-black/20 px-3 py-2 rounded text-sm block mt-2">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Создание платежа</h4>
                  <code className="bg-black/20 px-3 py-2 rounded text-sm block">
                    POST /api/payments/create<br/>
                    {JSON.stringify({
                      amount: 100,
                      description: "Тестовый платеж",
                      card_id: "optional"
                    }, null, 2)}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button Generator Modal */}
      {showButtonGenerator && developer?.api_key && (
        <ButtonGenerator
          apiKey={developer.api_key}
          onClose={() => setShowButtonGenerator(false)}
        />
      )}

      {/* Sandbox Modal */}
      {showSandbox && developer?.api_key && (
        <DeveloperSandbox
          apiKey={developer.api_key}
          onClose={() => setShowSandbox(false)}
        />
      )}

      {/* Docs Modal */}
      {showDocs && developer?.api_key && (
        <DeveloperDocs
          apiKey={developer.api_key}
          onClose={() => setShowDocs(false)}
        />
      )}
    </div>
  )
}
