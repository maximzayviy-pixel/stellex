import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Глобальные переменные для хранения клиентов
let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseAdminClient: ReturnType<typeof createClient> | null = null

// Функция для получения клиента с проверкой на существование
function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // На сервере всегда создаем новый клиент
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  }
  
  // На клиенте используем singleton
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseClient
}

function getSupabaseAdminClient() {
  if (typeof window === 'undefined') {
    // На сервере всегда создаем новый клиент
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  }
  
  // На клиенте используем singleton
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  }
  return supabaseAdminClient
}

// Экспортируем функции вместо готовых клиентов
export const getSupabase = getSupabaseClient
export const getSupabaseAdmin = getSupabaseAdminClient

// Для обратной совместимости создаем клиентов только когда они нужны
let _supabase: ReturnType<typeof createClient> | null = null
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabase = {
  get value() {
    if (!_supabase) {
      _supabase = getSupabaseClient()
    }
    return _supabase
  }
}

export const supabaseAdmin = {
  get value() {
    if (!_supabaseAdmin) {
      _supabaseAdmin = getSupabaseAdminClient()
    }
    return _supabaseAdmin
  }
}