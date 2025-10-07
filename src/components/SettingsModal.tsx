'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Smartphone, 
  Mail,
  Key,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { User as UserType } from '@/types'

interface SettingsModalProps {
  user: UserType
  onClose: () => void
  onUpdateUser: (updates: Partial<UserType>) => void
}

export default function SettingsModal({ user, onClose, onUpdateUser }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    username: user.username || ''
  })

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    language: 'ru',
    currency: 'STARS',
    dateFormat: 'DD.MM.YYYY'
  })

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        onUpdateUser(profileData)
        showSuccessMessage()
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Ошибка обновления профиля')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Пароли не совпадают')
      return
    }

    if (securityData.newPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        })
      })

      if (response.ok) {
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        showSuccessMessage()
      } else {
        const errorData = await response.json()
        alert(`Ошибка: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Ошибка смены пароля')
    } finally {
      setIsLoading(false)
    }
  }

  const showSuccessMessage = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'appearance', label: 'Внешний вид', icon: Palette }
  ]

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
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Настройки</h2>
              <p className="text-white/70">Управление вашим аккаунтом</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-3 flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Настройки сохранены!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex h-[60vh]">
          {/* Sidebar */}
          <div className="w-64 bg-white/5 border-r border-white/10 p-4">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === id
                      ? 'bg-purple-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Информация профиля</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Имя</label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Фамилия</label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Username</label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Сохранение...' : 'Сохранить'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Безопасность</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Текущий пароль</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Новый пароль</label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Подтвердите пароль</label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading || !securityData.currentPassword || !securityData.newPassword}
                    className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>{isLoading ? 'Смена пароля...' : 'Сменить пароль'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Уведомления</h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email уведомления', description: 'Получать уведомления на email' },
                      { key: 'pushNotifications', label: 'Push уведомления', description: 'Получать push уведомления в браузере' },
                      { key: 'transactionAlerts', label: 'Алерты транзакций', description: 'Уведомления о всех транзакциях' },
                      { key: 'securityAlerts', label: 'Безопасность', description: 'Уведомления о подозрительной активности' },
                      { key: 'marketingEmails', label: 'Маркетинг', description: 'Рекламные письма и предложения' }
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{label}</div>
                          <div className="text-white/70 text-sm">{description}</div>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            [key]: !notificationSettings[key as keyof typeof notificationSettings]
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings[key as keyof typeof notificationSettings]
                              ? 'bg-purple-600'
                              : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationSettings[key as keyof typeof notificationSettings]
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Внешний вид</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Тема</label>
                      <select
                        value={appearanceSettings.theme}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="dark">Темная</option>
                        <option value="light">Светлая</option>
                        <option value="auto">Автоматически</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Язык</label>
                      <select
                        value={appearanceSettings.language}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Валюта</label>
                      <select
                        value={appearanceSettings.currency}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, currency: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="STARS">Telegram Stars</option>
                        <option value="RUB">Рубли</option>
                        <option value="USD">Доллары</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
