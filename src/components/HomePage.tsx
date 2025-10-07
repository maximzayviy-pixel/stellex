'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Star, 
  Send, 
  QrCode, 
  Scan, 
  CreditCard, 
  Heart, 
  Rss,
  Bell,
  MessageSquare,
  MoreVertical,
  ChevronDown
} from 'lucide-react'
import { Card, User } from '@/types'

interface HomePageProps {
  user: User
  cards: Card[]
  onCreateCard: () => void
  onTopUp: () => void
  onTransfer: () => void
  onQRCode: () => void
  onScan: () => void
  showNotification: (message: string) => void
}

export default function HomePage({ 
  user, 
  cards, 
  onCreateCard, 
  onTopUp, 
  onTransfer, 
  onQRCode, 
  onScan, 
  showNotification 
}: HomePageProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(21)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'доброе утро'
    if (hour < 18) return 'добрый день'
    return 'добрый вечер'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-900">
      {/* System Status Bar */}
      <div className="flex justify-between items-center px-4 pt-2 pb-1">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <span className="text-white text-sm font-medium">{batteryLevel}%</span>
          <span className="text-white text-sm font-medium">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
          </div>
          <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Personalized Greeting */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.first_name?.toUpperCase()},
            </h1>
            <p className="text-white/80 text-lg">
              {getGreeting()}
            </p>
          </div>
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showNotification('Скоро здесь появятся пластиковые карты!')}
            className="p-4 bg-white/10 rounded-xl text-center hover:bg-white/20 transition-colors"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Заказать продукт</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showNotification('Мои подписки - в разработке')}
            className="p-4 bg-white/10 rounded-xl text-center hover:bg-white/20 transition-colors"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Мои подписки</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://t.me/stellexbank_bot', '_blank')}
            className="p-4 bg-white/10 rounded-xl text-center hover:bg-white/20 transition-colors"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Rss className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Наш канал</span>
          </motion.button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-white rounded-t-3xl min-h-screen px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Карты</h2>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
          <button
            onClick={onCreateCard}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 font-bold text-lg mb-2">Нет карт</h3>
            <p className="text-gray-500 mb-6">Создайте первую карту для начала работы</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateCard}
              className="py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Создать карту
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">VISA</h3>
                      <p className="text-white/70 text-sm">**** {card.card_number.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{card.balance.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-white/70 text-sm">Баланс</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onTopUp}
                    className="flex-1 py-2 px-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-center"
                  >
                    <Star className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Пополнить</span>
                  </button>
                  <button
                    onClick={onTransfer}
                    className="flex-1 py-2 px-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-center"
                  >
                    <Send className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Перевести</span>
                  </button>
                  <button
                    onClick={onQRCode}
                    className="flex-1 py-2 px-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-center"
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">QR код</span>
                  </button>
                  <button
                    onClick={onScan}
                    className="flex-1 py-2 px-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-center"
                  >
                    <Scan className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Сканировать</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}
