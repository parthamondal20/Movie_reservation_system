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
            sc.screen_number
        FROM shows s
        JOIN screens sc ON s.screen_id = sc.id  
        JOIN theaters th ON sc.theater_id = th.id
        WHERE s.movie_id = $1 AND LOWER(th.city) = LOWER($2)
        ORDER BY th.name, sc.screen_number, s.start_time
    `, [movie_id, location]);
    const shows = result.rows;
    console.log(shows);
    return res.status(200)
        .json(new ApiResponse(200, "Shows fetched successfully", shows));
})

export {
    getShowsByMovieId
}