import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
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

    const { userId, amount, type, description } = await request.json()

    if (!userId || !amount || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    if (!['credit', 'debit'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid operation type' }, { status: 400 })
    }

    // Получаем карты пользователя
    const { data: cards, error: cardsError } = await supabaseAdmin.value.value
      .from('cards')
      .select('id, balance')
      .eq('user_id', userId)
      .eq('status', 'active')

    if (cardsError) {
      console.error('Error fetching user cards:', cardsError)
      return NextResponse.json({ success: false, error: 'Failed to fetch user cards' }, { status: 500 })
    }

    if (!cards || cards.length === 0) {
      return NextResponse.json({ success: false, error: 'User has no active cards' }, { status: 400 })
    }

    // Выбираем первую активную карту
    const card = cards[0]
    const newBalance = type === 'credit' 
      ? card.balance + amount 
      : Math.max(0, card.balance - amount)

    // Обновляем баланс карты
    const { error: updateError } = await supabaseAdmin.value.value
      .from('cards')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', card.id)

    if (updateError) {
      console.error('Error updating card balance:', updateError)
      return NextResponse.json({ success: false, error: 'Failed to update balance' }, { status: 500 })
    }

    // Создаем запись транзакции
    const { error: transactionError } = await supabaseAdmin.value.value
      .from('transactions')
      .insert({
        user_id: userId,
        card_id: card.id,
        type: type === 'credit' ? 'topup' : 'withdrawal',
        amount: amount,
        currency: 'STARS',
        description: description || `Admin ${type}: ${amount} STARS`,
        status: 'completed',
        metadata: {
          admin_action: true,
          admin_id: decodedToken.userId
        }
      })

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      // Не возвращаем ошибку, так как баланс уже обновлен
    }

    return NextResponse.json({ 
      success: true, 
      newBalance,
      message: `Balance ${type === 'credit' ? 'increased' : 'decreased'} by ${amount} STARS`
    })
  } catch (error) {
    console.error('Admin balance API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
