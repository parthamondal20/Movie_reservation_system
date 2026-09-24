CREATE TABLE IF NOT EXISTS booking_seats (
        id SERIAL PRIMARY KEY,
        seat_id INT REFERENCES seat(id) ON DELETE CASCADE,
        booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
        price NUMERIC(10,2) NOT NULL,
        UNIQUE(booking_id, seat_id)
)