'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, ArrowRight, CreditCard } from 'lucide-react'
import { Card } from '@/types'

interface TelegramStarsModalProps {
  cards: Card[]
  onClose: () => void
  onTopUp: (data: { cardId: string; starsAmount: number }) => void
  showNotification: (message: string) => void
}

export default function TelegramStarsModal({ cards, onClose, onTopUp, showNotification }: TelegramStarsModalProps) {
  const [cardId, setCardId] = useState('')
  const [starsAmount, setStarsAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cardId) {
      showNotification('Выберите карту для пополнения')
      return
    }

    if (!starsAmount || parseFloat(starsAmount) <= 0) {
      showNotification('Введите корректное количество звезд')
      return
    }

    setIsLoading(true)
    
    try {
      await onTopUp({
        cardId,
        starsAmount: parseFloat(starsAmount)
      })
      onClose()
    } catch (error) {
      console.error('Stars topup error:', error)
      showNotification('Ошибка пополнения')
    } finally {
      setIsLoading(false)
    }
  }

  const quickStarsAmounts = [10, 50, 100, 200, 500]
  const selectedCard = cards.find(c => c.id === cardId)
  const rublesAmount = Math.floor(parseFloat(starsAmount || '0') / 2)

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
            <h2 className="text-2xl font-bold text-gray-900">Пополнение звездами</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telegram Stars Info */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 text-white mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Star className="w-6 h-6" />
              <span className="font-bold text-lg">Telegram Stars</span>
            </div>
            <p className="text-sm opacity-90">
              Пополните карту звездами Telegram
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Карта для пополнения
              </label>
              <select
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
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

            {/* Stars Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество звезд
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={starsAmount}
                  onChange={(e) => setStarsAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  min="1"
                  step="1"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500">
                  ⭐
                </span>
              </div>
              
              {/* Quick Stars Buttons */}
              <div className="grid grid-cols-5 gap-2 mt-3">
                {quickStarsAmounts.map((quickStars) => (
                  <button
                    key={quickStars}
                    type="button"
                    onClick={() => setStarsAmount(quickStars.toString())}
                    className="py-2 px-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors border border-yellow-200"
                  >
                    {quickStars}⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Info */}
            {starsAmount && parseFloat(starsAmount) > 0 && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700">Курс обмена:</span>
                  <span className="text-sm text-yellow-700">2 ⭐ = 1 ₽</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-yellow-200">
                  <span className="text-sm text-yellow-700">Получите на карту:</span>
                  <span className="font-bold text-lg text-yellow-800">
                    {rublesAmount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            )}

            {/* Selected Card Info */}
            {selectedCard && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    **** **** **** {selectedCard.card_number.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Текущий баланс:</span>
                  <span className="font-bold">
                    {selectedCard.balance.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                {starsAmount && parseFloat(starsAmount) > 0 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Баланс после пополнения:</span>
                    <span className="font-bold text-lg">
                      {(selectedCard.balance + rublesAmount).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !cardId || !starsAmount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  <span>Пополнить звездами</span>
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
                <p className="font-medium mb-1">Как пополнить звездами:</p>
                <p>• Нажмите &quot;Пополнить звездами&quot;</p>
                <p>• В Telegram откроется окно оплаты</p>
                <p>• Подтвердите покупку звезд</p>
                <p>• Звезды автоматически конвертируются в рубли</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
