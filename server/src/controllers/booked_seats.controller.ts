import asyncHandler from "../utils/asyncHandler";
import pool from "../configs/db";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const getBookedSeats = asyncHandler(async (req, res) => {
    const { show_id } = req.params;
    if (!show_id) throw new ApiError(400, "Show id is required");
    const result = await pool.query(`
        SELECT bs.seat_id
        FROM booking_seats bs
        JOIN bookings b ON bs.booking_id = b.id
        WHERE b.show_id = $1 AND b.status = 'booked'
    `, [show_id]);

    return res.status(200).json(new ApiResponse(200, "Booked seats fetched successfully", result.rows));
});

export { getBookedSeats };