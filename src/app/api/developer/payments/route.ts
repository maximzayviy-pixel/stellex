import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
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
      .select('id')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single()

    if (devError || !developer) {
      return NextResponse.json(
        { success: false, error: 'Неверный или неактивный API ключ' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''

    let query = supabaseAdmin.value
      .from('payment_requests')
      .select('*', { count: 'exact' })
      .eq('developer_id', developer.id)

    // Фильтр по статусу
    if (status) {
      query = query.eq('status', status)
    }

    // Пагинация
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: payments, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка загрузки платежей' },
        { status: 500 }
      )
    }

    // Получаем статистику
    const { data: stats } = await supabaseAdmin.value
      .from('payment_requests')
      .select('status, amount')
      .eq('developer_id', developer.id)

    const totalPayments = stats?.length || 0
    const completedPayments = stats?.filter(p => p.status === 'completed').length || 0
    const totalAmount = stats?.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const pendingAmount = stats?.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    return NextResponse.json({
      success: true,
      payments: payments || [],
      stats: {
        total_payments: totalPayments,
        completed_payments: completedPayments,
        total_amount: totalAmount,
        pending_amount: pendingAmount,
        success_rate: totalPayments > 0 ? (completedPayments / totalPayments * 100).toFixed(2) : 0
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Developer payments API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
