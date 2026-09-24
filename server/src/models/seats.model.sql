CREATE TABLE IF NOT EXISTS seat(
    id SERIAL PRIMARY KEY,
    screen_id INT REFERENCES screens(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    row_number INT NOT NULL,
    col_number INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    seat_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    UNIQUE(screen_id, row_number, col_number)
);

-- ═══════════════════════════════════════════════════════════════════
-- Function: auto-generate all seats for a given screen
-- Uses the screen's seat_rows & seat_cols to create seats
-- Assigns tier-based pricing:
--   Top 25% rows    → Premium  (₹350)
--   Middle 40% rows → Standard (₹250)
--   Bottom 35% rows → Economy  (₹150)
-- Seat numbers are labeled like A1, A2, B1, B2, etc.
-- ═══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION generate_seats_for_screen(p_screen_id INT)
RETURNS void AS $$
DECLARE
    v_rows INT;
    v_cols INT;
    v_row INT;
    v_col INT;
    v_seat_type VARCHAR(20);
    v_price NUMERIC(10,2);
    v_seat_number VARCHAR(10);
    v_premium_end INT;
    v_standard_end INT;
BEGIN
    -- Get screen dimensions
    SELECT seat_rows, seat_cols INTO v_rows, v_cols
    FROM screens WHERE id = p_screen_id;

    IF v_rows IS NULL THEN
        RAISE EXCEPTION 'Screen % not found', p_screen_id;
    END IF;

    -- Delete existing seats for this screen (idempotent)
    DELETE FROM seat WHERE screen_id = p_screen_id;

    -- Calculate tier boundaries
    v_premium_end  := GREATEST(1, CEIL(v_rows * 0.25));
    v_standard_end := GREATEST(v_premium_end + 1, CEIL(v_rows * 0.65));

    FOR v_row IN 0..(v_rows - 1) LOOP
        FOR v_col IN 0..(v_cols - 1) LOOP
            -- Determine tier
            IF v_row < v_premium_end THEN
                v_seat_type := 'premium';
                v_price := 350.00;
            ELSIF v_row < v_standard_end THEN
                v_seat_type := 'standard';
                v_price := 250.00;
            ELSE
                v_seat_type := 'economy';
                v_price := 150.00;
            END IF;

            -- Generate label: row letter + col number (A1, A2, B1, ...)
            v_seat_number := CHR(65 + v_row) || (v_col + 1)::TEXT;

            INSERT INTO seat (screen_id, seat_number, row_number, col_number, price, seat_type)
            VALUES (p_screen_id, v_seat_number, v_row, v_col, v_price, v_seat_type);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════
-- Generate seats for ALL existing screens
-- Run this after inserting screens in seed.sql
-- ═══════════════════════════════════════════════════════════════════
-- SELECT generate_seats_for_screen(id) FROM screens;