-- Create duties table
CREATE TABLE IF NOT EXISTS duties (
    id SERIAL PRIMARY KEY, -- 自動遞增 ID
    name VARCHAR(100) NOT NULL CHECK (length(trim(name)) > 0) -- 限制長度與非空值（邊緣情況防禦）
);