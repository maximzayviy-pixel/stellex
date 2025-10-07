'use client'

import React from 'react'
import { AuthProvider } from '@/components/AuthProvider'
import BankingApp from '@/components/BankingApp'

export default function AppPage() {
  return (
    <AuthProvider>
      <BankingApp />
    </AuthProvider>
  )
}
