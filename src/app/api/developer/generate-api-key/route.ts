import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
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

    // Проверяем, что пользователь - разработчик или админ
    if (decoded.role !== 'developer' && decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Доступ только для разработчиков и администраторов' },
        { status: 403 }
      )
    }

    // Генерируем новый API ключ
    const apiKey = `sk_${uuidv4().replace(/-/g, '')}_${Date.now().toString(36)}`

    if (decoded.role === 'admin') {
      // Для админа возвращаем ключ без сохранения в БД
      return NextResponse.json({
        success: true,
        apiKey: apiKey,
        message: 'API ключ сгенерирован (админский доступ)'
      })
    }

    // Для разработчика сначала проверяем, существует ли запись
    const { data: existingDeveloper, error: checkError } = await supabaseAdmin.value
      .from('developers')
      .select('id')
      .eq('user_id', decoded.userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking developer:', checkError)
      return NextResponse.json(
        { success: false, error: 'Ошибка проверки разработчика' },
        { status: 500 }
      )
    }

    let developer
    if (!existingDeveloper) {
      // Создаем запись разработчика, если её нет
      const { data: newDeveloper, error: createError } = await supabaseAdmin.value
        .from('developers')
        .insert({
          user_id: decoded.userId,
          api_key: apiKey,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating developer:', createError)
        return NextResponse.json(
          { success: false, error: 'Ошибка создания записи разработчика' },
          { status: 500 }
        )
      }
      developer = newDeveloper
    } else {
      // Обновляем существующую запись
      const { data: updatedDeveloper, error: updateError } = await supabaseAdmin.value
        .from('developers')
        .update({ 
          api_key: apiKey,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', decoded.userId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating API key:', updateError)
        return NextResponse.json(
          { success: false, error: 'Ошибка обновления API ключа' },
          { status: 500 }
        )
      }
      developer = updatedDeveloper
    }

    return NextResponse.json({
      success: true,
      apiKey: apiKey,
      message: 'API ключ успешно обновлен'
    })
  } catch (error) {
    console.error('Generate API key error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
