'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, AlertCircle, Code, User, Mail, Link, FileText, Building } from 'lucide-react'

interface ApiKeyRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiKeyRequestModal({ isOpen, onClose }: ApiKeyRequestModalProps) {
  const [formData, setFormData] = useState({
    telegram_username: '',
    email: '',
    project_name: '',
    project_description: '',
    project_url: '',
    company_name: '',
    expected_volume: '',
    use_case: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/developer/request-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
          onClose()
          setFormData({
            telegram_username: '',
            email: '',
            project_name: '',
            project_description: '',
            project_url: '',
            company_name: '',
            expected_volume: '',
            use_case: ''
          })
        }, 3000)
      } else {
        alert('Ошибка отправки заявки')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Ошибка отправки заявки')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Заявка на API ключ</h2>
                    <p className="text-white/70 text-sm">Заполните форму для получения доступа к API</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h3>
                  <p className="text-white/70">
                    Ваша заявка на получение API ключа отправлена. 
                    Мы рассмотрим её в течение 24 часов и свяжемся с вами.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Telegram Username
                      </label>
                      <input
                        type="text"
                        name="telegram_username"
                        value={formData.telegram_username}
                        onChange={handleChange}
                        placeholder="@username"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Название проекта
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleChange}
                      placeholder="Название вашего проекта"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Описание проекта
                    </label>
                    <textarea
                      name="project_description"
                      value={formData.project_description}
                      onChange={handleChange}
                      placeholder="Опишите ваш проект и как вы планируете использовать API"
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        <Link className="w-4 h-4 inline mr-2" />
                        Ссылка на проект
                      </label>
                      <input
                        type="url"
                        name="project_url"
                        value={formData.project_url}
                        onChange={handleChange}
                        placeholder="https://yourproject.com"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        <Building className="w-4 h-4 inline mr-2" />
                        Компания
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Название компании (необязательно)"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Ожидаемый объем транзакций
                      </label>
                      <select
                        name="expected_volume"
                        value={formData.expected_volume}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Выберите объем</option>
                        <option value="<1000">Менее 1,000 транзакций/месяц</option>
                        <option value="1000-10000">1,000 - 10,000 транзакций/месяц</option>
                        <option value="10000-100000">10,000 - 100,000 транзакций/месяц</option>
                        <option value=">100000">Более 100,000 транзакций/месяц</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Случай использования
                      </label>
                      <select
                        name="use_case"
                        value={formData.use_case}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Выберите случай использования</option>
                        <option value="ecommerce">E-commerce платформа</option>
                        <option value="saas">SaaS приложение</option>
                        <option value="mobile_app">Мобильное приложение</option>
                        <option value="web_app">Веб-приложение</option>
                        <option value="api_service">API сервис</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Отправка...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Отправить заявку</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 text-white/70 hover:text-white transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
