import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Токен не предоставлен' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Неверный токен' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь - разработчик
    if (decoded.role !== 'developer') {
      return NextResponse.json(
        { success: false, error: 'Доступ только для разработчиков' },
        { status: 403 }
      )
    }

    // Получаем данные разработчика
    const { data: developer, error: devError } = await supabaseAdmin.value
      .from('developers')
      .select('*')
      .eq('user_id', decoded.userId)
      .single()

    if (devError) {
      console.error('Developer profile error:', devError)
      return NextResponse.json(
        { success: false, error: 'Ошибка загрузки профиля разработчика' },
        { status: 500 }
      )
    }

    // Получаем платежные запросы разработчика
    const { data: paymentRequests, error: paymentsError } = await supabaseAdmin.value
      .from('payment_requests')
      .select('*')
      .eq('developer_id', developer.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (paymentsError) {
      console.error('Payment requests error:', paymentsError)
    }

    return NextResponse.json({
      success: true,
      developer,
      paymentRequests: paymentRequests || []
    })
  } catch (error) {
    console.error('Developer profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Токен не предоставлен' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Неверный токен' },
        { status: 401 }
      )
    }

    if (decoded.role !== 'developer') {
      return NextResponse.json(
        { success: false, error: 'Доступ только для разработчиков' },
        { status: 403 }
      )
    }

    const { company_name, website, webhook_url, commission_rate } = await request.json()

    // Обновляем профиль разработчика
    const { data, error } = await supabaseAdmin.value
      .from('developers')
      .update({
        company_name: company_name || null,
        website: website || null,
        webhook_url: webhook_url || null,
        commission_rate: commission_rate || 0.05,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', decoded.userId)
      .select()
      .single()

    if (error) {
      console.error('Developer update error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления профиля' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      developer: data
    })
  } catch (error) {
    console.error('Developer update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}