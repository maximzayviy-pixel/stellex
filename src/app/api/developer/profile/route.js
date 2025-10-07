import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Токен не предоставлен' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'developer') {
      return NextResponse.json({ success: false, error: 'Доступ запрещен' }, { status: 403 })
    }

    // Получаем данные разработчика
    const { data: developer, error: developerError } = await supabaseAdmin
      .from('developers')
      .select('*')
      .eq('user_id', decoded.userId)
      .single()

    if (developerError || !developer) {
      return NextResponse.json(
        { success: false, error: 'Профиль разработчика не найден' },
        { status: 404 }
      )
    }

    // Получаем платежные запросы
    const { data: paymentRequests, error: requestsError } = await supabaseAdmin
      .from('payment_requests')
      .select('*')
      .eq('developer_id', developer.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (requestsError) {
      console.error('Error loading payment requests:', requestsError)
    }

    return NextResponse.json({
      success: true,
      developer: developer,
      paymentRequests: paymentRequests || []
    })
  } catch (error) {
    console.error('Developer profile API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Токен не предоставлен' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'developer') {
      return NextResponse.json({ success: false, error: 'Доступ запрещен' }, { status: 403 })
    }

    const body = await request.json()
    const { webhook_url, payment_percentage } = body

    // Обновляем профиль разработчика
    const { data: developer, error: updateError } = await supabaseAdmin
      .from('developers')
      .update({
        webhook_url: webhook_url || null,
        payment_percentage: payment_percentage || 0.95,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', decoded.userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating developer profile:', updateError)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления профиля' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      developer: developer
    })
  } catch (error) {
    console.error('Developer profile update API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
