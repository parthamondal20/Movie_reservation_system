import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import QRCode from "qrcode";
import crypto from "crypto";
const bookSeats = asyncHandler(async (req, res) => {
    const { userId, showId, seats } = req.body;
    if (!userId || !showId) throw new ApiError(400, "Invalid Request");
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

interface Booking {
    booking_id: number;
    movie_title: string;
    theater_name: string;
    screen_name: string;
    start_time: Date;
    end_time: Date;
    ticket_number: string;
    qrcode: string;
    booked_at: Date;
    total_amount: number;
    seats: string[];
}


const getBookings = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new ApiError(400, "User id not found");

    const result = await pool.query(`
        SELECT 
    b.id AS booking_id,
    b.total_amount AS total_amount,
    b.booked_at AS booked_at, 
    b.status AS booking_status,

    m.title AS movie_title,

    s.start_time AS start_time,
    s.end_time AS end_time,

    th.name AS theater_name,
    sc.screen_number AS screen_name,

    s2.seat_number AS seat_number,

    t.ticket_number AS ticket_number,
    t.status AS ticket_status,
    t.qrcode AS qrcode

FROM bookings b

JOIN shows s 
    ON b.show_id = s.id

JOIN movies m 
    ON s.movie_id = m.id

JOIN booking_seats bs 
    ON bs.booking_id = b.id

JOIN seat s2 
    ON bs.seat_id = s2.id

JOIN ticket t 
    ON t.booking_id = b.id

JOIN screens sc 
    ON s.screen_id = sc.id

JOIN theaters th 
    ON sc.theater_id = th.id

WHERE b.user_id = $1

ORDER BY b.booked_at DESC
    `, [userId])

    // trans form the result using reduce 
    const bookings: Booking[] = [];

    for (const row of result.rows) {

        let booking = bookings.find(
            (b) => b.booking_id === row.booking_id
        );

        if (!booking) {
            booking = {
                booking_id: row.booking_id,
                movie_title: row.movie_title,
                theater_name: row.theater_name,
                screen_name: row.screen_name,
                start_time: row.start_time,
                end_time: row.end_time,
                ticket_number: row.ticket_number,
                qrcode: row.qrcode,
                booked_at: row.booked_at,
                total_amount: row.total_amount,
                seats: []
            };

            bookings.push(booking);
        }

        booking.seats.push(row.seat_number);
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Bookings Fetched", bookings))

})

export {
    bookSeats,
    getBookings
}