import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)

    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    // Получаем статистику
    const [
      usersResult,
      cardsResult,
      transactionsResult,
      developersResult
    ] = await Promise.all([
      supabaseAdmin.value.from('users').select('id, total_spent', { count: 'exact' }),
      supabaseAdmin.value.from('cards').select('id, balance', { count: 'exact' }),
      supabaseAdmin.value.from('transactions').select('amount', { count: 'exact' }),
      supabaseAdmin.value.from('developers').select('id, total_earnings', { count: 'exact' })
    ])

    const totalUsers = usersResult.count || 0
    const totalCards = cardsResult.count || 0
    const totalTransactions = transactionsResult.count || 0
    
    // Считаем общий доход из транзакций
    const totalRevenue = transactionsResult.data?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0
    
    // Считаем общий баланс всех карт
    const totalCardBalance = cardsResult.data?.reduce((sum, card) => sum + (card.balance || 0), 0) || 0

    const stats = {
      totalUsers,
      totalCards,
      totalTransactions,
      totalRevenue,
      totalCardBalance,
      totalDevelopers: developersResult.count || 0,
      totalDeveloperEarnings: developersResult.data?.reduce((sum, dev) => sum + (dev.total_earnings || 0), 0) || 0
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
