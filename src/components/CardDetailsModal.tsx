'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  CreditCard, 
  Star, 
  Send, 
  ArrowUp, 
  Copy, 
  Eye, 
  EyeOff,
  Calendar,
  Shield
} from 'lucide-react'
import { Card } from '@/types'
import { formatCardNumber, maskCardNumber } from '@/lib/cardUtils'

interface CardDetailsModalProps {
  card: Card
  onClose: () => void
  onTopUp: () => void
  onTransfer: () => void
  onStarsTopUp: () => void
}

export default function CardDetailsModal({ 
  card, 
  onClose, 
  onTopUp, 
  onTransfer, 
  onStarsTopUp 
}: CardDetailsModalProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState('')

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const cardGradient = card.status === 'active' 
    ? 'from-purple-600 via-blue-600 to-indigo-600'
    : card.status === 'blocked'
    ? 'from-red-600 to-red-800'
    : 'from-gray-600 to-gray-800'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Детали карты</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Display */}
          <div className={`relative bg-gradient-to-br ${cardGradient} rounded-3xl p-6 text-white mb-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Stellex Card</h3>
                  <p className="text-white/70 text-sm">
                    {card.status === 'active' ? 'Активна' : 
                     card.status === 'blocked' ? 'Заблокирована' : 
                     card.status === 'pending' ? 'Ожидает активации' : 'Требует активации'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-mono tracking-wider mb-2">
                {showDetails ? formatCardNumber(card.card_number) : maskCardNumber(card.card_number)}
              </div>
              <div className="text-white/70">
                {card.holder_name}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {card.balance.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-white/70 text-sm">
                  Доступно
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-sm">Срок действия</div>
                <div className="font-mono">{card.expiry_date}</div>
              </div>
            </div>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/20"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">CVV</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-lg">{card.cvv}</span>
                      <button
                        onClick={() => handleCopy(card.cvv, 'cvv')}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Номер карты</span>
                    <button
                      onClick={() => handleCopy(card.card_number, 'number')}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">ID карты</span>
                    <button
                      onClick={() => handleCopy(card.id, 'id')}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTopUp}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowUp className="w-5 h-5" />
              <span>Пополнить</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTransfer}
              className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Перевести</span>
            </motion.button>
          </div>

          {/* Additional Actions */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStarsTopUp}
              className="w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>Пополнить звездами</span>
            </motion.button>
          </div>

          {/* Card Info */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Информация о карте</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Создана:</span>
                  <span>{new Date(card.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Обновлена:</span>
                  <span>{new Date(card.updated_at).toLocaleDateString('ru-RU')}</span>
                </div>
                {card.last_used && (
                  <div className="flex justify-between">
                    <span>Последнее использование:</span>
                    <span>{new Date(card.last_used).toLocaleDateString('ru-RU')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Безопасность</span>
              </div>
              <p className="text-sm text-blue-700">
                Ваша карта защищена современными методами шифрования. 
                Никогда не сообщайте CVV код третьим лицам.
              </p>
            </div>
          </div>

          {/* Copy Success Message */}
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {copied === 'cvv' && 'CVV скопирован!'}
              {copied === 'number' && 'Номер карты скопирован!'}
              {copied === 'id' && 'ID карты скопирован!'}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
