'use client'

import { AuthProvider } from '@/components/AuthProvider'
import BankingApp from '@/components/BankingApp'

export default function Home() {
  return (
    <AuthProvider>
      <BankingApp />
    </AuthProvider>
  )
}