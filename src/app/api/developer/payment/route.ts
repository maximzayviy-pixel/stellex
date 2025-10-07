import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'API ключ не предоставлен' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7)
    
    // Проверяем API ключ разработчика
    const { data: developer, error: devError } = await supabaseAdmin.value
      .from('developers')
      .select('*, user:users(*)')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single()

    if (devError || !developer) {
      return NextResponse.json(
        { success: false, error: 'Неверный или неактивный API ключ' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      amount, 
      description, 
      card_id, 
      return_url, 
      webhook_url,
      metadata = {} 
    } = body

    // Валидация
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Неверная сумма платежа' },
        { status: 400 }
      )
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Описание платежа обязательно' },
        { status: 400 }
      )
    }

    // Создаем платеж
    const paymentId = uuidv4()
    const { data: payment, error: paymentError } = await supabaseAdmin.value
      .from('payment_requests')
      .insert({
        id: paymentId,
        developer_id: developer.id,
        amount: amount,
        description: description,
        card_id: card_id || null,
        return_url: return_url || null,
        webhook_url: webhook_url || developer.webhook_url,
        status: 'pending',
        metadata: {
          ...metadata,
          created_via: 'api',
          developer_name: developer.company_name || 'Unknown Developer'
        }
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment creation error:', paymentError)
      return NextResponse.json(
        { success: false, error: 'Ошибка создания платежа' },
        { status: 500 }
      )
    }

    // Создаем URL для оплаты
    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}/pay/${paymentId}`

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        description: payment.description,
        status: payment.status,
        payment_url: paymentUrl,
        created_at: payment.created_at
      }
    })
  } catch (error) {
    console.error('Developer payment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
