import asyncHandler from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import pool from "../../configs/db";
const addMovie = asyncHandler(async (req, res) => {
    const { rating, title, description, release_date, duration, genre, poster } = req.body;
    const result = await pool.query(`
        INSERT INTO  movies (title,description,release_date,duration,genre,rating,poster) 
         VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `, [title, description, release_date, duration, genre, rating, poster])
    const movie = result.rows[0];
    return res.status(201)
        .json(new ApiResponse(201, "Movie addedd successfully", movie))
})
export {
    addMovie
}