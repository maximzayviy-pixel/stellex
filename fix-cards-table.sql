-- Быстрое исправление таблицы cards
-- Удаляем таблицу если она существует
DROP TABLE IF EXISTS cards CASCADE;

-- Создаем таблицу cards заново
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_number TEXT UNIQUE NOT NULL,
  holder_name TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  cvv TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending', 'awaiting_activation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Создаем индекс
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_card_number ON cards(card_number);

-- Включаем RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Создаем триггер для updated_at
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


