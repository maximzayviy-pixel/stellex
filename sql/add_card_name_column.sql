-- Добавляем колонку card_name в таблицу cards
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_name VARCHAR(50) DEFAULT 'VISA';

-- Обновляем существующие карты
UPDATE cards SET card_name = 'VISA' WHERE card_name IS NULL;
