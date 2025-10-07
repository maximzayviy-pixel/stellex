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

    // Для разработчика обновляем ключ в БД
    const { data: developer, error: devError } = await supabaseAdmin.value
      .from('developers')
      .update({ 
        api_key: apiKey,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', decoded.userId)
      .select()
      .single()

    if (devError) {
      console.error('Error updating API key:', devError)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления API ключа' },
        { status: 500 }
      )
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
