'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  RefreshCw, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'topup' | 'transfer' | 'payment'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  created_at: string
  card_number?: string
}

interface TransactionHistoryPageProps {
  onBack: () => void
}

export default function TransactionHistoryPage({ onBack }: TransactionHistoryPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      } else {
        console.error('Error loading transactions:', await response.text())
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.card_number?.includes(searchQuery)
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-purple-400" />
      default:
        return <DollarSign className="w-5 h-5 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string, amount: number) => {
    if (type === 'topup' || amount > 0) {
      return 'text-green-400'
    } else {
      return 'text-red-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    const sign = amount > 0 ? '+' : ''
    return `${sign}${amount.toLocaleString('ru-RU')} ₽`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">История транзакций</h1>
              <p className="text-white/70">Все ваши операции с картами</p>
            </div>
          </div>
          <button
            onClick={loadTransactions}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по описанию или номеру карты"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Все типы</option>
              <option value="topup">Пополнения</option>
              <option value="transfer">Переводы</option>
              <option value="payment">Платежи</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="completed">Завершено</option>
              <option value="pending">В обработке</option>
              <option value="failed">Ошибка</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/70">Загрузка транзакций...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Нет транзакций</h3>
              <p className="text-white/70">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                  ? 'По вашему запросу ничего не найдено'
                  : 'У вас пока нет операций с картами'
                }
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center space-x-2 text-white/50 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(transaction.created_at)}</span>
                        {transaction.card_number && (
                          <>
                            <span>•</span>
                            <span>**** {transaction.card_number.slice(-4)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                      {formatAmount(transaction.amount)}
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' && 'Завершено'}
                      {transaction.status === 'pending' && 'В обработке'}
                      {transaction.status === 'failed' && 'Ошибка'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-white/70">
              <span>Всего транзакций:</span>
              <span className="font-bold text-white">{filteredTransactions.length}</span>
            </div>
            <div className="flex items-center justify-between text-white/70 mt-2">
              <span>Общая сумма:</span>
              <span className="font-bold text-white">
                {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
