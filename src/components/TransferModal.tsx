'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, ArrowRight, User, CreditCard } from 'lucide-react'
import { Card } from '@/types'

interface TransferModalProps {
  cards: Card[]
  onClose: () => void
  onTransfer: (data: { fromCardId: string; toCardNumber: string; amount: number; description?: string }) => void
  showNotification: (message: string) => void
}

export default function TransferModal({ cards, onClose, onTransfer, showNotification }: TransferModalProps) {
  const [fromCardId, setFromCardId] = useState('')
  const [toCardNumber, setToCardNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fromCardId) {
      showNotification('Выберите карту для списания')
      return
    }

    if (!toCardNumber) {
      showNotification('Введите номер карты получателя')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      showNotification('Введите корректную сумму')
      return
    }

    const fromCard = cards.find(c => c.id === fromCardId)
    if (!fromCard) {
      showNotification('Карта не найдена')
      return
    }

    if (fromCard.balance < parseFloat(amount)) {
      showNotification('Недостаточно средств на карте')
      return
    }

    // Валидация номера карты (должен начинаться с 666)
    if (!toCardNumber.startsWith('666') || toCardNumber.length !== 16) {
      showNotification('Неверный формат номера карты')
      return
    }

    setIsLoading(true)
    
    try {
      await onTransfer({
        fromCardId,
        toCardNumber,
        amount: parseFloat(amount),
        description: description || 'Перевод между картами'
      })
      onClose()
    } catch (error) {
      console.error('Transfer error:', error)
      showNotification('Ошибка перевода')
    } finally {
      setIsLoading(false)
    }
  }

  const quickAmounts = [100, 500, 1000, 2000, 5000]
  const selectedCard = cards.find(c => c.id === fromCardId)

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
            <h2 className="text-2xl font-bold text-gray-900">Перевод</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Карта списания
              </label>
              <select
                value={fromCardId}
                onChange={(e) => setFromCardId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Выберите карту</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    **** **** **** {card.card_number.slice(-4)} - {card.balance.toLocaleString('ru-RU')} ₽
                  </option>
                ))}
              </select>
            </div>

            {/* To Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер карты получателя
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toCardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 16) {
                      setToCardNumber(value)
                    }
                  }}
                  placeholder="6666 6666 6666 6666"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  maxLength={16}
                  required
                />
                <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Введите 16-значный номер карты, начинающийся с 666
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма перевода
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  min="1"
                  step="1"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₽
                </span>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2 mt-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    {quickAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Комментарий (необязательно)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Назначение перевода"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={100}
              />
            </div>

            {/* Balance Info */}
            {selectedCard && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Доступно на карте:</span>
                  <span className="font-bold text-lg">
                    {selectedCard.balance.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                {amount && parseFloat(amount) > 0 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Остаток после перевода:</span>
                    <span className={`font-bold ${
                      selectedCard.balance - parseFloat(amount) < 0 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {(selectedCard.balance - parseFloat(amount)).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !fromCardId || !toCardNumber || !amount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Отправить перевод</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-blue-500 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Информация о переводах:</p>
                <p>• Переводы выполняются мгновенно</p>
                <p>• Комиссия за перевод не взимается</p>
                <p>• Номер карты должен начинаться с 666</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

