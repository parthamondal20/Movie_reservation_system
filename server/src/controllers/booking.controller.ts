import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import QRCode from "qrcode";
import crypto from "crypto";
const bookSeats = asyncHandler(async (req, res) => {
    const { userId, showId, seats } = req.body;
    if (!userId || !showId) throw new ApiError(400, "Invalid Request");
    console.log("its here");
    let total_amount = 0;
    for (const seat of seats) {
        total_amount += seat.price;
    }
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // handle payment here 


        // create the booking 

        const result = await client.query(`
        INSERT INTO bookings (user_id,show_id,total_amount) VALUES ($1,$2,$3) RETURNING * 
    `, [userId, showId, total_amount]);

        const booking = result.rows[0];

        // mark seats as booking seats 

        for (const seat of seats) {
            await client.query(`
            INSERT INTO booking_seats (booking_id,seat_id,price) VALUES ($1,$2,$3)
    `, [booking.id, seat.seatId, seat.price]);
        }

        // generate the ticket number

        const ticket_number = `TKT` + crypto
            .randomBytes(4)
            .toString("hex").toUpperCase();

        // create the ticket 
        const qrCode = await QRCode.toDataURL(ticket_number);
        const ticketResult = await client.query(`
            INSERT INTO ticket (ticket_number,booking_id,qrcode) VALUES ($1,$2,$3) RETURNING *`, [ticket_number, booking.id, qrCode]);

        await client.query("COMMIT");

        console.log("booking successful");
        return res
            .status(200)
            .json(new ApiResponse(200, "Booking Successful", ticketResult.rows[0]));


    } catch (err) {
        console.error("Booking error:", err);
        await client.query("ROLLBACK");
        throw new ApiError(500, "Failed to perform booking please try again");
    } finally {
        client.release();
    }
})

export {
    bookSeats
}