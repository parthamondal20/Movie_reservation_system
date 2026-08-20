CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    password TEXT NOT NULL,
    role VARCHAR(10) DEFAULT 'user',
    google_id TEXT NULL,
    refresh_token TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
