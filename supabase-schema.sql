-- Создание таблицы пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  username VARCHAR(255),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  language_code VARCHAR(10),
  is_premium BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'developer', 'support', 'admin')),
  total_spent DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы карт
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_number VARCHAR(16) UNIQUE NOT NULL,
  holder_name VARCHAR(255) NOT NULL,
  expiry_date VARCHAR(5) NOT NULL,
  cvv VARCHAR(3) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'blocked', 'pending', 'awaiting_activation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Создание таблицы транзакций
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('topup', 'payment', 'card_creation', 'transfer_out', 'transfer_in', 'telegram_stars_topup', 'withdrawal', 'refund')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  external_id VARCHAR(255),
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы разработчиков
CREATE TABLE developers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  api_key VARCHAR(255) UNIQUE NOT NULL,
  webhook_url VARCHAR(500),
  commission_rate DECIMAL(5,2) DEFAULT 2.5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы платежных запросов
CREATE TABLE payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы тикетов поддержки
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  support_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_card_number ON cards(card_number);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_card_id ON transactions(card_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_developers_user_id ON developers(user_id);
CREATE INDEX idx_developers_api_key ON developers(api_key);
CREATE INDEX idx_payment_requests_developer_id ON payment_requests(developer_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_support_id ON support_tickets(support_id);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_requests_updated_at BEFORE UPDATE ON payment_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция для перевода денег между картами
CREATE OR REPLACE FUNCTION transfer_money(
  from_card_id UUID,
  to_card_id UUID,
  transfer_amount DECIMAL(15,2),
  transfer_description TEXT
)
RETURNS VOID AS $$
DECLARE
  from_user_id UUID;
  to_user_id UUID;
BEGIN
  -- Получаем владельцев карт
  SELECT user_id INTO from_user_id FROM cards WHERE id = from_card_id;
  SELECT user_id INTO to_user_id FROM cards WHERE id = to_card_id;
  
  -- Проверяем, что карты существуют
  IF from_user_id IS NULL OR to_user_id IS NULL THEN
    RAISE EXCEPTION 'Одна из карт не найдена';
  END IF;
  
  -- Проверяем баланс
  IF (SELECT balance FROM cards WHERE id = from_card_id) < transfer_amount THEN
    RAISE EXCEPTION 'Недостаточно средств';
  END IF;
  
  -- Обновляем балансы
  UPDATE cards SET balance = balance - transfer_amount WHERE id = from_card_id;
  UPDATE cards SET balance = balance + transfer_amount WHERE id = to_card_id;
  
  -- Создаем транзакции
  INSERT INTO transactions (user_id, card_id, type, amount, description, status)
  VALUES (from_user_id, from_card_id, 'transfer_out', transfer_amount, transfer_description, 'completed');
  
  INSERT INTO transactions (user_id, card_id, type, amount, description, status, recipient_id)
  VALUES (to_user_id, to_card_id, 'transfer_in', transfer_amount, transfer_description, 'completed', from_user_id);
END;
$$ LANGUAGE plpgsql;

-- Включение Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Политики RLS для пользователей
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Политики RLS для карт
CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Политики RLS для транзакций
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Политики RLS для разработчиков
CREATE POLICY "Developers can view own data" ON developers FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Developers can update own data" ON developers FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Политики RLS для платежных запросов
CREATE POLICY "Developers can view own payment requests" ON payment_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM developers WHERE id = developer_id AND user_id::text = auth.uid()::text)
);

-- Политики RLS для тикетов поддержки
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Support can view all tickets" ON support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role IN ('support', 'admin'))
);
CREATE POLICY "Support can update tickets" ON support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role IN ('support', 'admin'))
);
