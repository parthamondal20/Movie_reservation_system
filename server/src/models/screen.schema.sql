CREATE TABLE screens (
    id SERIAL PRIMARY KEY,
    theater_id INT REFERENCES theaters(id) ON DELETE CASCADE,
    screen_number VARCHAR(50) UNIQUE,
    seat_rows INT NOT NULL,
    seat_cols INT NOT NULL
);