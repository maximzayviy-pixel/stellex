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
import TransactionHistoryPage from './TransactionHistoryPage'
import SettingsPage from './SettingsPage'
import UserTicketsModal from './UserTicketsModal'
import HomePage from './HomePage'
import CosmicPreloader from './CosmicPreloader'

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
  const [showTickets, setShowTickets] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)
  const [currentUser, setCurrentUser] = useState(user)

  // Загружаем данные пользователя и карты
  useEffect(() => {
    if (user) {
      setCurrentUser(user)
      loadUserData()
    }
  }, [user])

  // Проверяем PIN-код при загрузке
  useEffect(() => {
    if (user) {
      const savedPin = localStorage.getItem('user_pin')
      if (savedPin) {
        setShowPreloader(false)
      }
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
        console.log('Loaded cards:', data.cards)
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
        showNotification('Баланс пополнен звездами!')
      } else {
        showNotification(result.error || 'Ошибка пополнения')
      }
    } catch (error) {
      console.error('Telegram Stars top-up error:', error)
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

  const handleUpdateUser = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }))
  }

  const showNotification = (message: string) => {
    // Простое уведомление через alert, можно заменить на toast
    alert(message)
  }

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

  // Показываем прелоадер если нужно
  if (showPreloader) {
    return (
      <CosmicPreloader
        user={user}
        onComplete={() => setShowPreloader(false)}
      />
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
    <div className="min-h-screen">
      <TelegramDebug />
      
      {/* Main Content */}
      {activeTab === 'cards' && (
        <HomePage
          user={currentUser}
          cards={cards}
          onCreateCard={handleCreateCard}
          onTopUp={() => setShowTopUpModal(true)}
          onTransfer={() => setShowTransferModal(true)}
          onQRCode={() => setShowQRCodeModal(true)}
          onScan={() => setShowQRCodeModal(true)}
          onCardClick={handleCardExpand}
          showNotification={showNotification}
        />
      )}

      {activeTab === 'history' && (
        <TransactionHistoryPage onBack={() => setActiveTab('cards')} />
      )}

      {activeTab === 'support' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="p-4 pt-12">
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
                  className="py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300"
                >
                  Создать заявку
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <SettingsPage user={currentUser} onBack={() => setActiveTab('cards')} onUpdateUser={handleUpdateUser} />
      )}

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

        {showTickets && (
          <UserTicketsModal
            onClose={() => setShowTickets(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
