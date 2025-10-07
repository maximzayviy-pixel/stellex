import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { user_id, role } = await request.json()

    if (!user_id || !role) {
      return NextResponse.json(
        { success: false, error: 'Необходимы user_id и role' },
        { status: 400 }
      )
    }

    if (!['user', 'developer', 'support', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Неверная роль' },
        { status: 400 }
      )
    }

    // Обновляем роль пользователя
    const { data, error } = await supabaseAdmin.value
      .from('users')
      .update({ role: role })
      .eq('id', user_id)
      .select()
      .single()

    if (error) {
      console.error('Role update error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления роли' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data,
      message: `Роль пользователя обновлена на ${role}`
    })
  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
