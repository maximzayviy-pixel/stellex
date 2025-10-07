'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Plus, 
  Wallet, 
  History, 
  Settings, 
  Star, 
  LogOut, 
  Mail,
  QrCode,
  Send,
  Scan,
  MessageSquare,
  HelpCircle
} from 'lucide-react'
import VirtualCard from './VirtualCard'
import TopUpModal from './TopUpModal'
import TransferModal from './TransferModal'
import TelegramStarsModal from './TelegramStarsModal'
import CardDetailsModal from './CardDetailsModal'
import QRCodeModal from './QRCodeModal'
import BottomNavigation from './BottomNavigation'
import { Card, TopUpData, User } from '@/types'
import { supabaseAdmin } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import DeveloperDashboard from './DeveloperDashboard'
import SupportDashboard from './SupportDashboard'
import AdminDashboard from './AdminDashboard'
import TelegramDebug from './TelegramDebug'
import TransactionHistory from './TransactionHistory'
import SettingsModal from './SettingsModal'
import UserTicketsModal from './UserTicketsModal'

export default function BankingApp() {
  const { user, logout } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showTelegramStarsModal, setShowTelegramStarsModal] = useState(false)
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'cards' | 'history' | 'settings' | 'support'>('cards')
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false)
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTickets, setShowTickets] = useState(false)

  // Загружаем данные пользователя и карты
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      
      // Загружаем карты пользователя через API
      const response = await fetch('/api/cards', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCards(data.cards || [])
      } else {
        console.error('Error loading cards:', await response.text())
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCard = async () => {
    if (!user) return

    // Проверяем лимит карт (максимум 3)
    if (cards.length >= 3) {
      showNotification('Максимум 3 карты на аккаунт')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          user_id: user.id,
          holder_name: `${user.first_name} ${user.last_name || ''}`.trim() || 'ПОЛЬЗОВАТЕЛЬ'
        })
      })

      const data = await response.json()

      if (data.success) {
        await loadUserData()
        showNotification('Карта успешно создана!')
      } else {
        showNotification(data.error || 'Ошибка создания карты')
      }
    } catch (error) {
      console.error('Error creating card:', error)
      showNotification('Ошибка создания карты')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopUp = (data: TopUpData) => {
    const card = cards.find(c => c.id === data.cardId)
    if (card) {
      setSelectedCard(card)
      setShowTopUpModal(true)
    }
  }

  const handleTransfer = async (data: { fromCardId: string; toCardNumber: string; amount: number }) => {
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        await loadUserData()
        showNotification('Перевод выполнен!')
      } else {
        showNotification(result.error || 'Ошибка перевода')
      }
    } catch (error) {
      console.error('Transfer error:', error)
      showNotification('Ошибка перевода')
    }
  }

  const handleTelegramStarsTopUp = async (data: { cardId: string; starsAmount: number }) => {
    try {
      const response = await fetch('/api/telegram-stars/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        await loadUserData()
        showNotification('Пополнение звездами выполнено!')
      } else {
        showNotification(result.error || 'Ошибка пополнения')
      }
    } catch (error) {
      console.error('Stars topup error:', error)
      showNotification('Ошибка пополнения')
    }
  }

  const handleCardExpand = (cardId: string) => {
    const card = cards.find(c => c.id === cardId)
    if (card) {
      setSelectedCard(card)
      setShowCardDetailsModal(true)
    }
  }

  const showNotification = (message: string) => {
    // Простое уведомление для веб-версии
    alert(message)
  }

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0)
  const totalStars = Math.floor(totalBalance * 2) // 1 рубль = 2 звезды

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Показываем разные панели в зависимости от роли пользователя
  if (user.role === 'developer') {
    return <DeveloperDashboard />
  }

  if (user.role === 'support') {
    return <SupportDashboard />
  }

  if (user.role === 'admin') {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <TelegramDebug />
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Stellex</h1>
            <p className="text-white/70">Банк со звездами Telegram</p>
          </div>
          <div className="flex items-center space-x-3">
            {user.email && (
              <div className="flex items-center space-x-2 text-white/70">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.first_name.charAt(0)}{user.last_name?.charAt(0) || ''}
              </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">
                {user.first_name} {user.last_name || ''}
              </h2>
              <p className="text-white/70 text-sm">
                {user.telegram_id ? `ID: ${user.telegram_id}` : 'Веб-пользователь'}
              </p>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/70 font-bold">Баланс</h3>
            <div className="flex items-center space-x-2 text-white/70">
              <Star className="w-4 h-4" />
              <span className="text-sm">{totalStars} ⭐</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-4">
            {totalBalance.toLocaleString('ru-RU')} ₽
          </div>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateCard}
              disabled={isLoading || cards.length >= 3}
              className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Создать карту
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTelegramStarsModal(true)}
              className="py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300"
            >
              <Star className="w-5 h-5 inline mr-2" />
              Пополнить
            </motion.button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTransferModal(true)}
            className="p-4 bg-white/10 backdrop-blur-sm rounded-xl text-center hover:bg-white/20 transition-colors"
          >
            <Send className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white text-sm font-medium">Перевести</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQRCodeModal(true)}
            className="p-4 bg-white/10 backdrop-blur-sm rounded-xl text-center hover:bg-white/20 transition-colors"
          >
            <QrCode className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white text-sm font-medium">QR код</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-white/10 backdrop-blur-sm rounded-xl text-center hover:bg-white/20 transition-colors"
          >
            <Scan className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white text-sm font-medium">Сканировать</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-32 overflow-y-auto">
        {activeTab === 'cards' && (
          <>
            <h3 className="text-white font-bold text-lg mb-4">Мои карты</h3>
            {cards.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 mb-4">У вас пока нет карт</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateCard}
                  className="py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Создать первую карту
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <VirtualCard
                    key={card.id}
                    card={card}
                    compact={true}
                    onExpand={() => handleCardExpand(card.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-8">
            <History className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">История транзакций</h3>
            <p className="text-white/70 mb-4">Просматривайте все ваши операции</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTransactionHistory(true)}
              className="py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Открыть историю
            </motion.button>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="text-center py-8">
            <MessageSquare className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Поддержка</h3>
            <p className="text-white/70 mb-4">Создайте заявку или просмотрите существующие</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTickets(true)}
                className="py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Мои заявки
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTickets(true)}
                className="py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Создать заявку
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-8">
            <Settings className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Настройки</h3>
            <p className="text-white/70 mb-4">Управление профилем и настройками</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSettings(true)}
              className="py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Открыть настройки
            </motion.button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <AnimatePresence>
        {showTopUpModal && selectedCard && (
          <TopUpModal
            card={selectedCard}
            onClose={() => {
              setShowTopUpModal(false)
              setSelectedCard(null)
            }}
            onTopUp={handleTopUp}
          />
        )}

        {showTransferModal && (
          <TransferModal
            cards={cards}
            onClose={() => setShowTransferModal(false)}
            onTransfer={handleTransfer}
            showNotification={showNotification}
          />
        )}

        {showTelegramStarsModal && (
          <TelegramStarsModal
            cards={cards}
            onClose={() => setShowTelegramStarsModal(false)}
            onTopUp={handleTelegramStarsTopUp}
            showNotification={showNotification}
          />
        )}

        {showQRCodeModal && (
          <QRCodeModal
            cards={cards}
            onClose={() => setShowQRCodeModal(false)}
            showNotification={showNotification}
          />
        )}

        {showCardDetailsModal && selectedCard && (
          <CardDetailsModal
            card={selectedCard}
            onClose={() => {
              setShowCardDetailsModal(false)
              setSelectedCard(null)
            }}
            onTopUp={() => handleTopUp({ cardId: selectedCard.id, amount: 0, paymentMethod: 'card' })}
            onTransfer={() => setShowTransferModal(true)}
            onStarsTopUp={() => setShowTelegramStarsModal(true)}
          />
        )}

        {showTransactionHistory && (
          <TransactionHistory
            onClose={() => setShowTransactionHistory(false)}
          />
        )}

        {showSettings && (
          <SettingsModal
            user={user}
            onClose={() => setShowSettings(false)}
            onUpdateUser={(updates) => {
              // Обновляем пользователя в контексте
              console.log('User updated:', updates)
            }}
          />
        )}

        {showTickets && (
          <UserTicketsModal
            onClose={() => setShowTickets(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
