import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Проверяем API ключ
    const { data: developer, error: developerError } = await supabase
      .from('developers')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single()

    if (developerError || !developer) {
      return NextResponse.json(
        { success: false, error: 'Неверный API ключ' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, description, card_id } = body

    if (!amount || !description) {
      return NextResponse.json(
        { success: false, error: 'Неверные данные' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Сумма должна быть больше 0' },
        { status: 400 }
      )
    }

    // Создаем платежный запрос
    const { data: paymentRequest, error: createError } = await supabase
      .from('payment_requests')
      .insert({
        developer_id: developer.id,
        amount,
        description,
        status: 'pending'
      })
      .select()
      .single()

    if (createError) {
      console.error('Create payment request error:', createError)
      return NextResponse.json(
        { success: false, error: 'Ошибка создания платежа' },
        { status: 500 }
      )
    }

    // Генерируем URL для оплаты
    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${paymentRequest.id}`

    return NextResponse.json({
      success: true,
      payment_request: paymentRequest,
      payment_url: paymentUrl
    })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
