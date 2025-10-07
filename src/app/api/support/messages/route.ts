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
    const ticketId = searchParams.get('ticketId')

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'Ticket ID is required' }, { status: 400 })
    }

    // Получаем сообщения заявки
    const { data: messages, error } = await supabaseAdmin.value.value
      .from('support_messages')
      .select(`
        *,
        user:users(first_name, last_name, email, role)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ success: true, messages: messages || [] })
  } catch (error) {
    console.error('Support messages API error:', error)
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

    const { ticketId, message } = await request.json()

    if (!ticketId || !message) {
      return NextResponse.json({ success: false, error: 'Ticket ID and message are required' }, { status: 400 })
    }

    // Создаем сообщение
    const { data: supportMessage, error } = await supabaseAdmin.value.value
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        user_id: decodedToken.userId,
        message,
        is_from_support: ['support', 'admin'].includes(decodedToken.role)
      })
      .select(`
        *,
        user:users(first_name, last_name, email, role)
      `)
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json({ success: false, error: 'Failed to create message' }, { status: 500 })
    }

    // Обновляем статус заявки на "в работе" если ответил саппорт
    if (['support', 'admin'].includes(decodedToken.role)) {
      await supabaseAdmin.value.value
        .from('support_tickets')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
    }

    return NextResponse.json({ success: true, message: supportMessage })
  } catch (error) {
    console.error('Create message API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
