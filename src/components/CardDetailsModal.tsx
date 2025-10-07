'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CreditCard, 
  Copy, 
  Edit3, 
  Check,
  Star,
  Send,
  QrCode,
  Scan
} from 'lucide-react'
import { Card } from '@/types'

interface CardDetailsModalProps {
  card: Card
  onClose: () => void
  onTopUp: () => void
  onTransfer: () => void
  onQRCode: () => void
  onScan: () => void
  showNotification: (message: string) => void
}

export default function CardDetailsModal({ 
  card, 
  onClose, 
  onTopUp, 
  onTransfer, 
  onQRCode, 
  onScan,
  showNotification 
}: CardDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [cardName, setCardName] = useState(card.card_name || 'VISA')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleSaveName = async () => {
    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          card_name: cardName
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Название карты обновлено!')
        setIsEditing(false)
      } else {
        showNotification(data.error || 'Ошибка обновления названия')
      }
    } catch (error) {
      console.error('Error updating card name:', error)
      showNotification('Ошибка обновления названия')
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      showNotification(`${field} скопирован!`)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Детали карты</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Card Preview */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="https://i.imgur.com/ogTdloq.png" 
                    alt="Stellex Logo" 
                    className="w-6 h-6 rounded"
                  />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="bg-white/20 text-white font-bold text-lg px-2 py-1 rounded"
                    autoFocus
                  />
                ) : (
                  <h3 className="font-bold text-lg">{cardName}</h3>
                )}
              </div>
              <button
                onClick={isEditing ? handleSaveName : () => setIsEditing(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isEditing ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold mb-1">{card.balance.toLocaleString('ru-RU')} ₽</p>
              <p className="text-white/70 text-sm">Баланс</p>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер карты
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={formatCardNumber(card.card_number)}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(card.card_number, 'Номер карты')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {copiedField === 'Номер карты' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV код
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={card.cvv}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(card.cvv, 'CVV код')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {copiedField === 'CVV код' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок действия
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={card.expiry_date}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(card.expiry_date, 'Срок действия')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {copiedField === 'Срок действия' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Владелец карты
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={card.holder_name}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
                <button
                  onClick={() => copyToClipboard(card.holder_name, 'Имя владельца')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {copiedField === 'Имя владельца' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onTopUp}
              className="py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Пополнить</span>
            </button>
            <button
              onClick={onTransfer}
              className="py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Перевести</span>
            </button>
            <button
              onClick={onQRCode}
              className="py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR код</span>
            </button>
            <button
              onClick={onScan}
              className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Scan className="w-4 h-4" />
              <span>Сканировать</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}