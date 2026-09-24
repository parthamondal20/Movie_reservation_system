CREATE TABLE ticket(
    id serial PRIMARY KEY,
    ticket_number varchar(255) NOT NULL UNIQUE,
    booking_id INT REFERENCES booking(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'valid',
    qrCode TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
