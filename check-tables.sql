-- Проверка существования таблиц и их структуры
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'cards', 'transactions', 'developers', 'support_tickets', 'payment_requests')
ORDER BY table_name, ordinal_position;

-- Проверка существования таблицы cards
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'cards'
) as cards_table_exists;

-- Проверка колонок в таблице cards
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cards'
ORDER BY ordinal_position;
