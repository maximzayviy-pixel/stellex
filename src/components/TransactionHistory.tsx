'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Star, 
  Filter,
  Search,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'topup' | 'transfer' | 'payment' | 'withdrawal' | 'refund'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  card?: {
    card_number: string
    holder_name: string
  }
  metadata?: any
}

interface TransactionHistoryProps {
  onClose: () => void
}

export default function TransactionHistory({ onClose }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadTransactions()
  }, [currentPage, typeFilter])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(typeFilter && { type: typeFilter })
      })

      const response = await fetch(`/api/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <TrendingUp className="w-5 h-5 text-green-400" />
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-purple-400" />
      case 'withdrawal':
        return <TrendingDown className="w-5 h-5 text-red-400" />
      case 'refund':
        return <ArrowDownLeft className="w-5 h-5 text-yellow-400" />
      default:
        return <Star className="w-5 h-5 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'topup':
        return 'text-green-400'
      case 'transfer':
        return 'text-blue-400'
      case 'payment':
        return 'text-purple-400'
      case 'withdrawal':
        return 'text-red-400'
      case 'refund':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'topup':
        return 'Пополнение'
      case 'transfer':
        return 'Перевод'
      case 'payment':
        return 'Платеж'
      case 'withdrawal':
        return 'Списание'
      case 'refund':
        return 'Возврат'
      default:
        return 'Транзакция'
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const sign = ['topup', 'refund'].includes(type) ? '+' : '-'
    return `${sign}${amount.toFixed(2)}`
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.card?.card_number.includes(searchTerm) ||
    getTransactionLabel(transaction.type).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">История транзакций</h2>
              <p className="text-white/70">Все ваши операции с картами</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по описанию или номеру карты..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Все типы</option>
                <option value="topup">Пополнения</option>
                <option value="transfer">Переводы</option>
                <option value="payment">Платежи</option>
                <option value="withdrawal">Списания</option>
                <option value="refund">Возвраты</option>
              </select>
              <button
                onClick={loadTransactions}
                className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Обновить</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Нет транзакций</h3>
              <p className="text-white/70">У вас пока нет операций с картами</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                              {getTransactionLabel(transaction.type)}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {transaction.status === 'completed' ? 'Завершено' :
                               transaction.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm">{transaction.description}</p>
                          {transaction.card && (
                            <p className="text-white/50 text-xs">
                              Карта: {transaction.card.card_number.slice(0, 4)} **** **** {transaction.card.card_number.slice(-4)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          ['topup', 'refund'].includes(transaction.type) ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)} {transaction.currency}
                        </div>
                        <div className="text-white/50 text-sm">
                          {new Date(transaction.created_at).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-white/70 text-sm">
                Страница {currentPage} из {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Назад
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Вперед
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
