-- Создание таблицы для заявок на API ключи
CREATE TABLE IF NOT EXISTS api_key_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  project_url VARCHAR(500),
  company_name VARCHAR(255),
  expected_volume VARCHAR(50),
  use_case VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_notes TEXT
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_api_key_requests_status ON api_key_requests(status);
CREATE INDEX IF NOT EXISTS idx_api_key_requests_created_at ON api_key_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_api_key_requests_email ON api_key_requests(email);

-- Включаем RLS
ALTER TABLE api_key_requests ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (только админы)
CREATE POLICY "Admins can view all API key requests" ON api_key_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Политика для вставки (все могут создавать заявки)
CREATE POLICY "Anyone can create API key requests" ON api_key_requests
  FOR INSERT WITH CHECK (true);

-- Политика для обновления (только админы)
CREATE POLICY "Admins can update API key requests" ON api_key_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
