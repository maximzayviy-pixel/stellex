'use client'

import React from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface LoadingErrorProps {
  onRetry?: () => void
  message?: string
}

export default function LoadingError({ onRetry, message = 'Ошибка загрузки' }: LoadingErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Ошибка загрузки</h1>
        <p className="text-white/70 mb-6">
          {message}
        </p>
        
        <div className="space-y-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Попробовать снова</span>
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            Обновить страницу
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-500/20 rounded-xl">
          <p className="text-yellow-200 text-sm">
            <strong>Совет:</strong> Проверьте подключение к интернету и попробуйте обновить страницу.
          </p>
        </div>
      </div>
    </div>
  )
}

