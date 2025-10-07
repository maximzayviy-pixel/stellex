'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  AlertCircle, 
  X, 
  Send,
  CheckCircle,
  Clock,
  User
} from 'lucide-react'

interface SupportTicketModalProps {
  onClose: () => void
  onTicketCreated: () => void
}

export default function SupportTicketModal({ onClose, onTicketCreated }: SupportTicketModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          onTicketCreated()
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Ошибка создания заявки')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/30 w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl mx-2"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Создать заявку</h2>
                <p className="text-white/70">Опишите вашу проблему или вопрос</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-green-400 font-semibold">Заявка создана!</div>
                <div className="text-green-300 text-sm">Мы ответим в ближайшее время</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="general">Общие вопросы</option>
                <option value="technical">Технические проблемы</option>
                <option value="billing">Платежи и баланс</option>
                <option value="cards">Карты</option>
                <option value="security">Безопасность</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Приоритет</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Тема заявки *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Кратко опишите проблему"
              className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Описание проблемы *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Подробно опишите вашу проблему или вопрос. Чем больше деталей вы предоставите, тем быстрее мы сможем помочь."
              rows={6}
              className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required
            />
          </div>

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-blue-300 text-sm">
                <div className="font-semibold mb-2">Советы для быстрого решения:</div>
                <ul className="space-y-1 text-blue-200">
                  <li>• Укажите номер карты, если проблема связана с картой</li>
                  <li>• Опишите шаги, которые привели к проблеме</li>
                  <li>• Приложите скриншоты, если это поможет</li>
                  <li>• Укажите время возникновения проблемы</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Создание...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Создать заявку</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Отмена
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
