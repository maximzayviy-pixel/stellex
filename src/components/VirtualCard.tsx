'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Eye, EyeOff, Copy, MoreVertical } from 'lucide-react'
import { Card } from '@/types'
import { formatCardNumber, maskCardNumber } from '@/lib/cardUtils'

interface VirtualCardProps {
  card: Card
  compact?: boolean
  onExpand?: () => void
}

export default function VirtualCard({ card, compact = false, onExpand }: VirtualCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const cardGradient = card.status === 'active' 
    ? 'from-purple-600 via-blue-600 to-indigo-600'
    : card.status === 'blocked'
    ? 'from-red-600 to-red-800'
    : 'from-gray-600 to-gray-800'

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative bg-gradient-to-br ${cardGradient} rounded-2xl p-4 text-white shadow-xl cursor-pointer`}
        onClick={onExpand}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span className="font-bold text-sm">
              {card.status === 'active' ? 'Активна' : 
               card.status === 'blocked' ? 'Заблокирована' : 
               card.status === 'pending' ? 'Ожидает' : 'Активация'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
            className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="mb-4">
          <div className="text-lg font-mono tracking-wider">
            {showDetails ? formatCardNumber(card.card_number) : maskCardNumber(card.card_number)}
          </div>
          <div className="text-sm text-white/70 mt-1">
            {card.holder_name}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {card.balance.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-sm text-white/70">
            {card.expiry_date}
          </div>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/20"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">CVV</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{card.cvv}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(card.cvv, 'CVV')
                    }}
                    className="p-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Номер карты</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(card.card_number, 'номер карты')
                  }}
                  className="p-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gradient-to-br ${cardGradient} rounded-3xl p-6 text-white shadow-2xl`}
    >
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

      <div className="flex items-center justify-between mb-6">
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
          className="pt-6 border-t border-white/20"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">CVV</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-lg">{card.cvv}</span>
                <button
                  onClick={() => handleCopy(card.cvv, 'CVV')}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Номер карты</span>
              <button
                onClick={() => handleCopy(card.card_number, 'номер карты')}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">ID карты</span>
              <button
                onClick={() => handleCopy(card.id, 'ID карты')}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
        >
          Скопировано!
        </motion.div>
      )}
    </motion.div>
  )
}

