import pool from "../configs/db";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

const getMe = asyncHandler(async (req, res) => {
    const id = req?.user?.id;

    const result = await pool.query(
        `
        SELECT id,name,email FROM users WHERE id=$1
        `, [id]
    );
    const user = result.rows[0];
    if (user.rows.length === 0) {
        throw new ApiError(401, "Falied to fetch the current user");
    }

    return res.status(200)
        .json(new ApiResponse(200, "Successfully fetched the user details", user));
})


export {
    getMe
}