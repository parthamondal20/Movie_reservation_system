CREATE TABLE shows (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(id),
    screen_id INT REFERENCES screens(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);