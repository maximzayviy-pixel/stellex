'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { User as UserType } from '@/types'

interface SettingsPageProps {
  user: UserType
  onBack: () => void
  onUpdateUser: (updates: Partial<UserType>) => void
}

export default function SettingsPage({ user, onBack, onUpdateUser }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || ''
  })

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    language: 'ru',
    currency: 'RUB'
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email
        })
      })

      const data = await response.json()

      if (data.success) {
        onUpdateUser(data.user)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert(data.error || 'Ошибка сохранения профиля')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Ошибка сохранения профиля')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      return
    }
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Reset form
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error saving security:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAppearance = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving appearance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'appearance', label: 'Внешний вид', icon: Palette }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Настройки</h1>
              <p className="text-white/70">Управление вашим аккаунтом</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-200">Настройки сохранены!</span>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-purple-600 text-white' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Информация профиля</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Введите имя"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Фамилия
                      </label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Введите фамилию"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Введите email"
                      />
                    </div>



                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Telegram Username
                      </label>
                      <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 flex items-center space-x-2">
                        <span>@</span>
                        <span>{user.username || 'Не указан'}</span>
                        <span className="text-xs text-white/30">(из Telegram)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="mt-6 w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Сохранить изменения</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Безопасность</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Текущий пароль
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                          placeholder="Введите текущий пароль"
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
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Введите новый пароль"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Подтвердите пароль
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Подтвердите новый пароль"
                      />
                    </div>

                    {securityData.newPassword && securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword && (
                      <div className="flex items-center space-x-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Пароли не совпадают</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSaveSecurity}
                    disabled={isLoading || securityData.newPassword !== securityData.confirmPassword}
                    className="mt-6 w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Key className="w-5 h-5" />
                        <span>Изменить пароль</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Уведомления</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <h3 className="text-white font-medium">
                            {key === 'pushNotifications' && 'Push уведомления'}
                            {key === 'emailNotifications' && 'Email уведомления'}
                            {key === 'transactionAlerts' && 'Уведомления о транзакциях'}
                            {key === 'securityAlerts' && 'Уведомления безопасности'}
                            {key === 'marketingEmails' && 'Маркетинговые письма'}
                          </h3>
                          <p className="text-white/50 text-sm">
                            {key === 'pushNotifications' && 'Получать уведомления в приложении'}
                            {key === 'emailNotifications' && 'Получать уведомления на email'}
                            {key === 'transactionAlerts' && 'Уведомления о всех операциях'}
                            {key === 'securityAlerts' && 'Уведомления о входе и безопасности'}
                            {key === 'marketingEmails' && 'Получать рекламные предложения'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !value }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            value ? 'bg-purple-600' : 'bg-white/20'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="mt-6 w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Bell className="w-5 h-5" />
                        <span>Сохранить настройки</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Внешний вид</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-3">
                        Тема
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'dark', label: 'Темная', icon: '🌙' },
                          { id: 'light', label: 'Светлая', icon: '☀️' }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: theme.id as any }))}
                            className={`p-4 rounded-xl border-2 transition-colors ${
                              appearanceSettings.theme === theme.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="text-2xl mb-2">{theme.icon}</div>
                            <div className="text-white font-medium">{theme.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-3">
                        Язык
                      </label>
                      <select
                        value={appearanceSettings.language}
                        onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-3">
                        Валюта
                      </label>
                      <select
                        value={appearanceSettings.currency}
                        onChange={(e) => setAppearanceSettings(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveAppearance}
                    disabled={isLoading}
                    className="mt-6 w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Palette className="w-5 h-5" />
                        <span>Сохранить настройки</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
