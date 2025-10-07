import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '@/types'
import { supabaseAdmin } from './supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function authenticateUser(telegramId: number, userData: { first_name: string; last_name?: string; username?: string; language_code?: string; is_premium?: boolean }): Promise<AuthResult> {
  try {
    // Ищем пользователя по Telegram ID
    const { data: existingUser, error: fetchError } = await supabaseAdmin.value
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError)
      return { success: false, error: 'Ошибка базы данных' }
    }

    let user: User

    if (existingUser) {
      // Обновляем данные существующего пользователя
      const updateData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        language_code: userData.language_code,
        is_premium: userData.is_premium,
        updated_at: new Date().toISOString()
      }
      
      const { data: updatedUser, error: updateError } = await supabaseAdmin.value
        .from('users')
        .update(updateData)
        .eq('id', existingUser.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return { success: false, error: 'Ошибка обновления пользователя' }
      }

      user = updatedUser
    } else {
      // Создаем нового пользователя
      const { data: newUser, error: createError } = await supabaseAdmin.value
        .from('users')
        .insert({
          telegram_id: telegramId,
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          language_code: userData.language_code,
          is_premium: userData.is_premium,
          role: 'user',
          total_spent: 0,
          email_verified: false
        })
        .select()
        .single()

      if (createError) {
        console.error('User creation error:', createError)
        return { success: false, error: 'Ошибка создания пользователя' }
      }

      user = newUser
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        telegramId: user.telegram_id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return { success: true, user, token }
  } catch (error) {
    console.error('Auth error:', error)
    return { success: false, error: 'Внутренняя ошибка сервера' }
  }
}

export async function authenticateEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabaseAdmin.value
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Пользователь не найден' }
    }

    if (!user.password_hash) {
      return { success: false, error: 'Неверный пароль' }
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: 'Неверный пароль' }
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        telegramId: user.telegram_id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return { success: true, user, token }
  } catch (error) {
    console.error('Email auth error:', error)
    return { success: false, error: 'Внутренняя ошибка сервера' }
  }
}

export async function registerEmail(email: string, password: string, firstName: string, lastName?: string): Promise<AuthResult> {
  try {
    // Проверяем, существует ли пользователь с таким email
        const { data: existingUser } = await supabaseAdmin.value
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return { success: false, error: 'Пользователь с таким email уже существует' }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const { data: user, error } = await supabaseAdmin.value
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: 'user',
        total_spent: 0,
        email_verified: false
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Ошибка создания пользователя' }
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        telegramId: user.telegram_id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return { success: true, user, token }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Внутренняя ошибка сервера' }
  }
}

export async function loginEmail(email: string, password: string): Promise<AuthResult> {
  try {
    // Находим пользователя по email
    const { data: user, error: userError } = await supabaseAdmin.value
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return { success: false, error: 'Пользователь не найден' }
    }

    if (!user.password_hash) {
      return { success: false, error: 'Неверный способ входа' }
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: 'Неверный пароль' }
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { success: true, user, token }
  } catch (error) {
    console.error('Email login error:', error)
    return { success: false, error: 'Ошибка входа' }
  }
}

export function verifyToken(token: string): { userId: string; telegramId?: number; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; telegramId?: number; role: string }
    return {
      userId: decoded.userId,
      telegramId: decoded.telegramId,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin.value
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}
