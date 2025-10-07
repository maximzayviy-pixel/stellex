import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { card_name } = await request.json()

    // Обновляем название карты
    const { data, error } = await supabaseAdmin.value
      .from('cards')
      .update({
        card_name: card_name || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', decoded.userId)
      .select()
      .single()

    if (error) {
      console.error('Card update error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления карты' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      card: data
    })
  } catch (error) {
    console.error('Card update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

