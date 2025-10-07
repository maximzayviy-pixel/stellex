'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, QrCode, Download, Copy, CreditCard, ArrowRight, Scan } from 'lucide-react'
import QRCode from 'qrcode'
import { Card } from '@/types'

interface QRCodeModalProps {
  cards: Card[]
  onClose: () => void
  showNotification: (message: string) => void
}

export default function QRCodeModal({ cards, onClose, showNotification }: QRCodeModalProps) {
  const [selectedCard, setSelectedCard] = useState('')
  const [qrType, setQrType] = useState<'payment' | 'transfer'>('payment')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const card = cards.find(c => c.id === selectedCard)

  useEffect(() => {
    if (selectedCard && qrType) {
      generateQRCode()
    }
  }, [selectedCard, qrType, amount, description])

  const generateQRCode = async () => {
    if (!selectedCard) return

    setIsGenerating(true)
    
    try {
      const qrData = {
        type: qrType,
        cardId: selectedCard,
        amount: qrType === 'payment' && amount ? parseFloat(amount) : undefined,
        description: description || undefined,
        timestamp: Date.now()
      }

      const qrString = JSON.stringify(qrData)
      const url = await QRCode.toDataURL(qrString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeUrl(url)
    } catch (error) {
      console.error('QR generation error:', error)
      showNotification('Ошибка генерации QR кода')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = `stellex-qr-${qrType}-${Date.now()}.png`
    link.href = qrCodeUrl
    link.click()
  }

  const handleCopy = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      showNotification('QR код скопирован в буфер обмена')
    } catch (error) {
      console.error('Copy error:', error)
      showNotification('Ошибка копирования')
    }
  }

  const startScanning = async () => {
    try {
      setIsScanning(true)
      setScanResult('')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      showNotification('Не удалось получить доступ к камере')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const captureAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    // Здесь можно добавить библиотеку для распознавания QR кодов
    // Пока что просто показываем сообщение
    showNotification('Функция сканирования QR кодов в разработке')
    setScanResult('QR код не распознан')
  }

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
            <h2 className="text-2xl font-bold text-gray-900">QR код</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите карту
            </label>
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Выберите карту</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  **** **** **** {card.card_number.slice(-4)} - {card.balance.toLocaleString('ru-RU')} ₽
                </option>
              ))}
            </select>
          </div>

          {/* QR Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Тип QR кода
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQrType('payment')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  qrType === 'payment'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <QrCode className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium text-sm">Для оплаты</div>
                  <div className="text-xs text-gray-500">Получить деньги</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setQrType('transfer')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  qrType === 'transfer'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <ArrowRight className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium text-sm">Для перевода</div>
                  <div className="text-xs text-gray-500">Отправить деньги</div>
                </div>
              </button>
            </div>
          </div>

          {/* Amount (for payment) */}
          {qrType === 'payment' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма (необязательно)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  step="1"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₽
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Оставьте пустым для любой суммы
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание (необязательно)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Назначение платежа"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* QR Code Display */}
          {selectedCard && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                {isGenerating ? (
                  <div className="py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Генерируем QR код...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div>
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="mx-auto mb-4 rounded-lg"
                    />
                    <p className="text-sm text-gray-600 mb-4">
                      {qrType === 'payment' 
                        ? 'Покажите этот код для получения платежа'
                        : 'Покажите этот код для перевода средств'
                      }
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDownload}
                        className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Скачать</span>
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Копировать</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Выберите карту для генерации QR кода</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card Info */}
          {card && (
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-bold">**** **** **** {card.card_number.slice(-4)}</span>
              </div>
              <div className="text-sm opacity-90">
                Баланс: {card.balance.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          )}

          {/* QR Scanner */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Сканировать QR код</h3>
            
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Scan className="w-5 h-5" />
                <span>Начать сканирование</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    autoPlay
                    playsInline
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={captureAndScan}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Сканировать
                  </button>
                  <button
                    onClick={stopScanning}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Остановить
                  </button>
                </div>
                
                {scanResult && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">{scanResult}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-blue-500 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Как использовать QR код:</p>
                <p>• Покажите QR код другому пользователю</p>
                <p>• Он отсканирует код через приложение</p>
                <p>• Деньги будут переведены на вашу карту</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
