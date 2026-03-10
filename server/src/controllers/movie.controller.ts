import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const getMovies = asyncHandler(async (req, res) => {
    console.log("its coming here");
    const { lastId, limit } = req.params;
    const result = await pool.query(`
        SELECT * FROM movies WHERE id>$1 ORDER BY id LIMIT $2;
    `, [lastId, limit]);
    const movies = result.rows;
    return res.status(200)
        .json(new ApiResponse(200, "Movies fetched successfully", movies));
})

const getMovieById = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;

    const result = await pool.query(`
        SELECT * FROM movies WHERE id=$1
    `, [movie_id]);

    const movie = result.rows[0];
    return res.status(200)
        .json(new ApiResponse(200, "Movie fetched successfully", movie));
})

export {
    getMovies,
    getMovieById
}