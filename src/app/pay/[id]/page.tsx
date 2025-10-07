'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Star, ArrowRight, X } from 'lucide-react'
import { PaymentRequest } from '@/types'
import { useAuth } from '@/components/AuthProvider'

interface PaymentPageProps {
  params: {
    id: string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { user } = useAuth()
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [selectedCard, setSelectedCard] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadPaymentRequest()
  }, [params.id])

  const loadPaymentRequest = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/payments/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setPaymentRequest(data.payment_request)
      } else {
        alert(data.error || 'Платеж не найден')
      }
    } catch (error) {
      console.error('Error loading payment request:', error)
      alert('Ошибка загрузки платежа')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedCard || !user) return

    try {
      setIsProcessing(true)
      
      const response = await fetch(`/api/payments/${params.id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          card_id: selectedCard
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Платеж выполнен успешно!')
        window.close()
      } else {
        alert(data.error || 'Ошибка платежа')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Ошибка платежа')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!paymentRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Платеж не найден</h1>
          <p className="text-white/70">Возможно, платеж был отменен или не существует</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="p-4 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Stellex Pay</h1>
            <p className="text-white/70">Безопасная оплата</p>
          </div>
          <button
            onClick={() => window.close()}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Payment Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Оплата</h2>
            <p className="text-white/70">{paymentRequest.description}</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {paymentRequest.amount.toLocaleString('ru-RU')} ₽
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/70">
              <Star className="w-4 h-4" />
              <span className="text-sm">
                {Math.floor(paymentRequest.amount * 2)} ⭐
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        {user ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Выберите карту</h3>
              <div className="space-y-3">
                {/* Здесь будут карты пользователя */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="card1"
                      name="card"
                      value="card1"
                      checked={selectedCard === 'card1'}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <CreditCard className="w-5 h-5 text-white/70" />
                    <div>
                      <div className="text-white font-medium">**** **** **** 1234</div>
                      <div className="text-white/70 text-sm">1,000 ₽</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={!selectedCard || isProcessing}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Оплатить</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-white font-bold text-lg mb-4">Войдите в аккаунт</h3>
            <p className="text-white/70 mb-6">
              Для оплаты необходимо войти в ваш аккаунт Stellex
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Войти в аккаунт
            </motion.button>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-blue-500 mt-0.5">🔒</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Безопасность</p>
              <p>Ваши данные защищены современными методами шифрования. Мы не храним данные ваших карт.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

