-- ══════════════════════════════════════
-- 1. THEATERS (5 cinemas across India)
-- ══════════════════════════════════════
INSERT INTO theaters (name, city, address) VALUES
('PVR Nexus',        'Delhi',     'Saket District Centre, Press Enclave Marg, Saket'),
('INOX Megaplex',    'Mumbai',    'Inorbit Mall, Link Road, Malad West'),
('Cinepolis Forum',  'Bangalore', 'Forum Mall, Hosur Road, Koramangala'),
('PVR Phoenix',      'Chennai',   'Phoenix MarketCity, Velachery Main Road'),
('Miraj Cinemas',    'Kolkata',   'South City Mall, Prince Anwar Shah Road');

-- ══════════════════════════════════════
-- 2. SCREENS (2-3 screens per theater)
-- ══════════════════════════════════════
-- PVR Nexus (theater_id = 1)
INSERT INTO screens (theater_id, screen_number, seat_rows, seat_cols) VALUES
(1, 'PVR-Screen 1',    10, 16),
(1, 'PVR-Screen 2',     8, 14),
(1, 'PVR-IMAX',        12, 20);

-- INOX Megaplex (theater_id = 2)
INSERT INTO screens (theater_id, screen_number, seat_rows, seat_cols) VALUES
(2, 'INOX-Screen 1',   10, 18),
(2, 'INOX-Screen 2',    8, 14),
(2, 'INOX-Gold',        6, 10);

-- Cinepolis Forum (theater_id = 3)
INSERT INTO screens (theater_id, screen_number, seat_rows, seat_cols) VALUES
(3, 'CP-Screen 1',     10, 16),
(3, 'CP-Screen 2',      8, 14);

-- PVR Phoenix (theater_id = 4)
INSERT INTO screens (theater_id, screen_number, seat_rows, seat_cols) VALUES
(4, 'PHX-Screen 1',    10, 16),
(4, 'PHX-Screen 2',     8, 12),
(4, 'PHX-IMAX',        12, 20);

-- Miraj Cinemas (theater_id = 5)
INSERT INTO screens (theater_id, screen_number, seat_rows, seat_cols) VALUES
(5, 'MRJ-Screen 1',    10, 16),
(5, 'MRJ-Screen 2',     8, 14);

-- ══════════════════════════════════════
-- 3. SHOWS (multiple showtimes per day)
-- ══════════════════════════════════════
-- NOTE: movie_id references the movies you already seeded (1-19).
--       screen_id references the screens created above (1-13).
--       Using dates a few days from now so they appear as "upcoming".

-- Inception (movie_id=1) at PVR Nexus Screen 1 & INOX Screen 1
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(1, 1,  '2026-08-22 10:00', '2026-08-22 12:30'),
(1, 1,  '2026-08-22 14:00', '2026-08-22 16:30'),
(1, 1,  '2026-08-22 18:00', '2026-08-22 20:30'),
(1, 4,  '2026-08-22 11:00', '2026-08-22 13:30'),
(1, 4,  '2026-08-22 17:00', '2026-08-22 19:30');

-- The Dark Knight (movie_id=2) at PVR IMAX & Cinepolis Screen 1
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(2, 3,  '2026-08-22 09:30', '2026-08-22 12:00'),
(2, 3,  '2026-08-22 15:00', '2026-08-22 17:30'),
(2, 3,  '2026-08-22 21:00', '2026-08-22 23:30'),
(2, 7,  '2026-08-22 10:00', '2026-08-22 12:30'),
(2, 7,  '2026-08-22 16:00', '2026-08-22 18:30');

-- Avengers: Endgame (movie_id=3) at INOX Gold & PVR Phoenix IMAX
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(3, 6,  '2026-08-23 10:00', '2026-08-23 13:00'),
(3, 6,  '2026-08-23 16:00', '2026-08-23 19:00'),
(3, 11, '2026-08-23 11:00', '2026-08-23 14:00'),
(3, 11, '2026-08-23 18:00', '2026-08-23 21:00');

-- Joker (movie_id=6) at PVR Screen 2 & Miraj Screen 1
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(6, 2,  '2026-08-22 11:00', '2026-08-22 13:00'),
(6, 2,  '2026-08-22 16:00', '2026-08-22 18:00'),
(6, 2,  '2026-08-22 20:30', '2026-08-22 22:30'),
(6, 12, '2026-08-22 12:00', '2026-08-22 14:00'),
(6, 12, '2026-08-22 19:00', '2026-08-22 21:00');

-- The Matrix (movie_id=7) at Cinepolis Screen 2 & PVR Phoenix Screen 1
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(7, 8,  '2026-08-23 09:00', '2026-08-23 11:15'),
(7, 8,  '2026-08-23 14:00', '2026-08-23 16:15'),
(7, 9,  '2026-08-23 10:30', '2026-08-23 12:45'),
(7, 9,  '2026-08-23 17:00', '2026-08-23 19:15');

-- Parasite (movie_id=18) at INOX Screen 2 & Miraj Screen 2
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(18, 5,  '2026-08-24 10:00', '2026-08-24 12:15'),
(18, 5,  '2026-08-24 15:00', '2026-08-24 17:15'),
(18, 13, '2026-08-24 11:30', '2026-08-24 13:45'),
(18, 13, '2026-08-24 18:00', '2026-08-24 20:15');

-- Oppenheimer (movie_id=not in first 19, skip) — use Gladiator (movie_id=5) instead
-- Gladiator at PVR Phoenix Screen 2 & INOX Screen 1
INSERT INTO shows (movie_id, screen_id, start_time, end_time) VALUES
(5, 10, '2026-08-24 09:30', '2026-08-24 12:00'),
(5, 10, '2026-08-24 14:30', '2026-08-24 17:00'),
(5, 4,  '2026-08-24 11:00', '2026-08-24 13:30'),
(5, 4,  '2026-08-24 19:00', '2026-08-24 21:30');
