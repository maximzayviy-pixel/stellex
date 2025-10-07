'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, History, Settings, MessageSquare } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: 'cards' | 'history' | 'settings' | 'support'
  onTabChange: (tab: 'cards' | 'history' | 'settings' | 'support') => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'cards' as const,
      label: 'Карты',
      icon: CreditCard
    },
    {
      id: 'history' as const,
      label: 'История',
      icon: History
    },
    {
      id: 'support' as const,
      label: 'Поддержка',
      icon: MessageSquare
    },
    {
      id: 'settings' as const,
      label: 'Настройки',
      icon: Settings
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-colors ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-600 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
