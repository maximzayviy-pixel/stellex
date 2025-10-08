'use client'

import React from 'react'
import { AuthProvider } from '@/components/AuthProvider'
import BankingApp from '@/components/BankingApp'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function AppPage() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BankingApp />
      </AuthProvider>
    </ErrorBoundary>
  )
}

