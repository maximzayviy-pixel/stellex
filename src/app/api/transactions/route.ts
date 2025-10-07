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
    const type = searchParams.get('type') || ''

    let query = supabaseAdmin.value
      .from('transactions')
      .select(`
        *,
        card:cards(card_number, holder_name)
      `)
      .eq('user_id', decodedToken.userId)

    // Фильтр по типу транзакции
    if (type) {
      query = query.eq('type', type)
    }

    // Пагинация
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: transactions, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      transactions: transactions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
