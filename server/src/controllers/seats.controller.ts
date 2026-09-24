import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

/**
 * GET /api/v1/seats/:screen_id
 * Fetch all seats for a given screen, ordered by row then column.
 */
const getSeatsByScreenId = asyncHandler(async (req, res) => {
    const { screen_id } = req.params;

    const result = await pool.query(
        `SELECT id, seat_number, row_number, col_number, price, seat_type
         FROM seat
         WHERE screen_id = $1
         ORDER BY row_number, col_number`,
        [screen_id]
    );

    return res.status(200)
        .json(new ApiResponse(200, "Seats fetched successfully", result.rows));
});

/**
 * GET /api/v1/seats/show/:show_id
 * Fetch all seats for the screen tied to a specific show.
 * This is what the SeatSelection page will call.
 */
const getSeatsByShowId = asyncHandler(async (req, res) => {
    const { show_id } = req.params;

    // Get all seats for the show's screen,
    // JOIN through booking_seats → bookings to derive status per seat
    const result = await pool.query(
        `SELECT
            s.id,
            s.seat_number,
            s.row_number,
            s.col_number,
            s.price,
            s.seat_type,
            CASE WHEN bs.id IS NOT NULL THEN COALESCE(b.status, 'booked') ELSE 'available' END AS status
         FROM seat s
         JOIN shows sh ON sh.screen_id = s.screen_id
         LEFT JOIN booking_seats bs ON bs.seat_id = s.id
         LEFT JOIN bookings b ON b.id = bs.booking_id AND b.show_id = sh.id
         WHERE sh.id = $1
         ORDER BY s.row_number, s.col_number`,
        [show_id]
    );

    if (result.rows.length === 0) {
        // Could be no show or no seats — check which
        const showCheck = await pool.query(`SELECT id FROM shows WHERE id = $1`, [show_id]);
        if (showCheck.rows.length === 0) {
            throw new ApiError(404, "Show not found");
        }
    }
    return res.status(200)
        .json(new ApiResponse(200, "Seats fetched successfully", result.rows));
});

export {
    getSeatsByScreenId,
    getSeatsByShowId
};
