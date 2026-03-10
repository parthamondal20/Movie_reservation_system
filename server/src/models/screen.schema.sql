CREATE TABLE screens (
    id SERIAL PRIMARY KEY,
    theater_id INT REFERENCES theaters(id),
    screen_number INT,
    total_seats INT
);