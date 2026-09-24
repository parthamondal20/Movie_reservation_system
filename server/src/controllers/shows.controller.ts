import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const getShowsByMovieId = asyncHandler(async (req, res) => {
    const { movie_id, location } = req.params;
    const result = await pool.query(`
        SELECT s.id,
            s.start_time,
            s.end_time,
            th.id AS theater_id,
            th.name AS theater_name,
            th.city,
            th.address,
            sc.screen_number,
            sc.id AS screen_id,
            sc.seat_rows AS row_number,
            sc.seat_cols as col_number
        FROM shows s
        JOIN screens sc ON s.screen_id = sc.id  
        JOIN theaters th ON sc.theater_id = th.id
        WHERE s.movie_id = $1 AND LOWER(th.city) = LOWER($2)
        ORDER BY th.name, sc.screen_number, s.start_time
    `, [movie_id, location]);
    const shows = result.rows;
    return res.status(200)
        .json(new ApiResponse(200, "Shows fetched successfully", shows));
})

const getShowById = asyncHandler(async (req, res) => {
    const { show_id } = req.params;
    const result = await pool.query(`
        SELECT s.id AS show_id,
            s.start_time,
            s.end_time,
            m.id AS movie_id,
            m.title AS movie_title,
            m.poster AS movie_poster,
            m.genre AS movie_genre,
            m.duration AS movie_duration,
            m.rating AS movie_rating,
            th.id AS theater_id,
            th.name AS theater_name,
            th.address AS theater_address,
            th.city AS theater_city,
            sc.screen_number,
            sc.seat_rows,
            sc.seat_cols
        FROM shows s
        JOIN screens sc ON s.screen_id = sc.id
        JOIN theaters th ON sc.theater_id = th.id
        JOIN movies m ON s.movie_id = m.id
        WHERE s.id = $1
    `, [show_id]);

    if (result.rows.length === 0) {
        throw new ApiError(404, "Show not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, "Show details fetched successfully", result.rows[0]));
})

export {
    getShowsByMovieId,
    getShowById
}