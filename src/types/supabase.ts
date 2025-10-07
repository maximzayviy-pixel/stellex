export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number | null
          email: string | null
          password_hash: string | null
          username: string | null
          first_name: string
          last_name: string | null
          language_code: string | null
          is_premium: boolean | null
          email_verified: boolean | null
          role: string
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id?: number | null
          email?: string | null
          password_hash?: string | null
          username?: string | null
          first_name: string
          last_name?: string | null
          language_code?: string | null
          is_premium?: boolean | null
          email_verified?: boolean | null
          role?: string
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number | null
          email?: string | null
          password_hash?: string | null
          username?: string | null
          first_name?: string
          last_name?: string | null
          language_code?: string | null
          is_premium?: boolean | null
          email_verified?: boolean | null
          role?: string
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          user_id: string
          card_number: string
          holder_name: string
          expiry_date: string
          cvv: string
          balance: number
          status: string
          created_at: string
          updated_at: string
          last_used: string | null
        }
        Insert: {
          id?: string
          user_id: string
          card_number: string
          holder_name: string
          expiry_date: string
          cvv: string
          balance?: number
          status?: string
          created_at?: string
          updated_at?: string
          last_used?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          card_number?: string
          holder_name?: string
          expiry_date?: string
          cvv?: string
          balance?: number
          status?: string
          created_at?: string
          updated_at?: string
          last_used?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string | null
          card_id: string | null
          type: string
          amount: number
          description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          card_id?: string | null
          type: string
          amount: number
          description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          card_id?: string | null
          type?: string
          amount?: number
          description?: string | null
          status?: string
          created_at?: string
        }
      }
      developers: {
        Row: {
          id: string
          user_id: string
          api_key: string
          webhook_url: string | null
          payment_percentage: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          api_key?: string
          webhook_url?: string | null
          payment_percentage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          api_key?: string
          webhook_url?: string | null
          payment_percentage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payment_requests: {
        Row: {
          id: string
          developer_id: string
          user_id: string | null
          amount: number
          currency: string
          description: string | null
          status: string
          redirect_url: string | null
          webhook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          developer_id: string
          user_id?: string | null
          amount: number
          currency?: string
          description?: string | null
          status?: string
          redirect_url?: string | null
          webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          developer_id?: string
          user_id?: string | null
          amount?: number
          currency?: string
          description?: string | null
          status?: string
          redirect_url?: string | null
          webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          status: string
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          message: string
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}