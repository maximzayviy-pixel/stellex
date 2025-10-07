'use client'

import React from 'react'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'

export default function TelegramDebug() {
  const { webApp, isReady, isTelegramWebApp, user, initData, platform, version, colorScheme, themeParams } = useTelegramWebApp()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxHeight: '200px',
      overflow: 'auto'
    }}>
      <h4>Telegram WebApp Debug:</h4>
      <div>isTelegramWebApp: {isTelegramWebApp ? '✅' : '❌'}</div>
      <div>isReady: {isReady ? '✅' : '❌'}</div>
      <div>platform: {platform || 'N/A'}</div>
      <div>version: {version || 'N/A'}</div>
      <div>colorScheme: {colorScheme || 'N/A'}</div>
      <div>user: {user ? `${user.first_name} (${user.id})` : 'N/A'}</div>
      <div>initData: {initData ? 'Present' : 'N/A'}</div>
      <div>webApp: {webApp ? 'Available' : 'N/A'}</div>
      <div>themeParams: {Object.keys(themeParams).length > 0 ? 'Present' : 'N/A'}</div>
    </div>
  )
}
