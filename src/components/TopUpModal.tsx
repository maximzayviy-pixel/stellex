'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CreditCard, Star, ArrowRight } from 'lucide-react'
import { Card, TopUpData } from '@/types'

interface TopUpModalProps {
  card: Card
  onClose: () => void
  onTopUp: (data: TopUpData) => void
}

export default function TopUpModal({ card, onClose, onTopUp }: TopUpModalProps) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'telegram' | 'card'>('telegram')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите корректную сумму')
      return
    }

    setIsLoading(true)
    
    try {
      await onTopUp({
        cardId: card.id,
        amount: parseFloat(amount),
        paymentMethod
      })
      onClose()
    } catch (error) {
      console.error('Top up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickAmounts = [100, 500, 1000, 2000, 5000]

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
            <h2 className="text-2xl font-bold text-gray-900">Пополнение карты</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Info */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 text-white mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">Карта</span>
              <span className="text-sm opacity-70">Баланс</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg">
                **** **** **** {card.card_number.slice(-4)}
              </span>
              <span className="text-xl font-bold">
                {card.balance.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма пополнения
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

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Способ пополнения
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="telegram"
                    checked={paymentMethod === 'telegram'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'telegram' | 'card')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === 'telegram' 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'telegram' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Звезды Telegram</div>
                      <div className="text-sm text-gray-500">
                        Пополнить через Telegram Stars
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'telegram' | 'card')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === 'card' 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'card' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Банковская карта</div>
                      <div className="text-sm text-gray-500">
                        Пополнить с банковской карты
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !amount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Пополнить карту</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-blue-500 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Курс обмена:</p>
                <p>1 рубль = 2 звезды Telegram</p>
                <p>Минимальная сумма пополнения: 1 рубль</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


