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

    if (!decodedToken) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''

    let query = supabaseAdmin.value
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(first_name, last_name, email, telegram_id)
      `)

    // Если пользователь не админ/саппорт, показываем только его заявки
    if (decodedToken.role === 'user') {
      query = query.eq('user_id', decodedToken.userId)
    }

    // Фильтр по статусу
    if (status) {
      query = query.eq('status', status)
    }

    // Пагинация
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: tickets, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tickets:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      tickets: tickets || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Support tickets API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const { subject, description, priority, category } = await request.json()

    if (!subject || !description) {
      return NextResponse.json({ success: false, error: 'Subject and description are required' }, { status: 400 })
    }

    // Создаем заявку
    const { data: ticket, error } = await supabaseAdmin.value
      .from('support_tickets')
      .insert({
        user_id: decodedToken.userId,
        subject,
        description,
        priority: priority || 'medium',
        category: category || 'general',
        status: 'open'
      })
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(first_name, last_name, email, telegram_id)
      `)
      .single()

    if (error) {
      console.error('Error creating ticket:', error)
      return NextResponse.json({ success: false, error: 'Failed to create ticket' }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    console.error('Create ticket API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    // Только саппорт и админы могут обновлять заявки
    if (!['support', 'admin'].includes(decodedToken.role)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
    }

    const { ticketId, updates } = await request.json()

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'Ticket ID is required' }, { status: 400 })
    }

    // Обновляем заявку
    const { data: ticket, error } = await supabaseAdmin.value
      .from('support_tickets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(first_name, last_name, email, telegram_id)
      `)
      .single()

    if (error) {
      console.error('Error updating ticket:', error)
      return NextResponse.json({ success: false, error: 'Failed to update ticket' }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    console.error('Update ticket API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
