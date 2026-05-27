-- Create duties table
CREATE TABLE IF NOT EXISTS duties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (length(trim(name)) > 0)
);