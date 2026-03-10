import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";


const getShowsByMovieId = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;
    const result = await pool.query(`
        SELECT * FROM shows WHERE movie_id=$1
    `, [movie_id]);
    const shows = result.rows;
    return res.status(200)
        .json(new ApiResponse(200, "Shows fetched successfully", shows));
})
