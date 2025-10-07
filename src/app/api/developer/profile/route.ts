import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    // Проверяем, что пользователь является разработчиком
    if (decoded.role !== 'developer') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Получаем данные разработчика
    const { data: developer, error: developerError } = await supabase
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
    const { data: paymentRequests, error: requestsError } = await supabase
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
      developer,
      paymentRequests: paymentRequests || []
    })
  } catch (error) {
    console.error('Get developer profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
