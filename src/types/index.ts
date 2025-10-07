export interface User {
  id: string;
  telegram_id?: number;
  email?: string;
  password_hash?: string;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  is_premium?: boolean;
  email_verified?: boolean;
  role: 'user' | 'developer' | 'support' | 'admin';
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  card_number: string;
  holder_name: string;
  expiry_date: string;
  cvv: string;
  balance: number;
  status: 'active' | 'blocked' | 'pending' | 'awaiting_activation';
  created_at: string;
  updated_at: string;
  last_used?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  card_id?: string;
  type: 'topup' | 'payment' | 'card_creation' | 'transfer_out' | 'transfer_in' | 'telegram_stars_topup' | 'withdrawal' | 'refund';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  external_id?: string;
  recipient_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRequest {
  id: string;
  developer_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Developer {
  id: string;
  user_id: string;
  company_name: string;
  website?: string;
  api_key: string;
  webhook_url?: string;
  commission_rate: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  support_id?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface PaymentData {
  amount: number;
  currency: 'stars';
  description: string;
  cardId?: string;
}

export interface CardCreationData {
  type: 'stellex';
  holderName: string;
  paymentMethod: 'free';
}

export interface TopUpData {
  cardId: string;
  amount: number;
  paymentMethod: 'telegram' | 'card';
}

export interface TransferData {
  fromCardId: string;
  toCardNumber: string;
  amount: number;
  description?: string;
}

export interface QRCodeData {
  type: 'payment' | 'transfer';
  amount?: number;
  cardId?: string;
  description?: string;
}

export type CardType = 'stellex';
export type PaymentMethod = 'telegram' | 'card';
export type TransactionType = 'topup' | 'payment' | 'card_creation' | 'transfer_out' | 'transfer_in' | 'telegram_stars_topup' | 'withdrawal' | 'refund';
export type UserRole = 'user' | 'developer' | 'support' | 'admin';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
