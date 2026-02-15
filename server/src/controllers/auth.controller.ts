import asyncHandler from "../utils/asyncHandler";
import pool from "../configs/db";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import generateAccessAndRefreshTokens from "../utils/generateJwtTokens";
const signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const exsitingUser = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]);
    if (exsitingUser.rows.length > 0) {
        throw new ApiError(400, "user already existed");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await pool.query(`
        INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email
        `, [name, email, hashedPassword]);
    const user_id = newUser.rows[0].id;
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user_id);
    const payload = {
        httpOnly: true,
        sameSite: "strict" as const,
        secure: process.env.NODE_ENV === "production"
    }
    return res.status(201)
        .cookie("accessToken", accessToken, payload)
        .cookie("refreshToken", refreshToken, payload)
        .json(new ApiResponse(201, "User created successfully", newUser.rows[0]));
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query(
        `SELECT name,email,id,password FROM users WHERE email=$1 
        `, [email]
    )
    if (result.rows.length === 0) {
        throw new ApiError(401, "User not found");
    }
    const user = result.rows[0];
    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
        throw new ApiError(400, "Incorrect password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);
    const payload = {
        httpOnly: true,
        sameSite: "strict" as const,
        secure: process.env.NODE_ENV === "production"
    }
    const { password: _, ...newUser } = user;
    return res.status(200)
        .cookie("accessToken", accessToken, payload)
        .cookie("refreshToken", refreshToken, payload)
        .json(new ApiResponse(200, "login successful", newUser));
})

const logout = asyncHandler(async (req, res) => {
    const user_id = req?.user?.id;
    await pool.query(`
        UPDATE users 
        SET refresh_token=NULL
        WHERE id=$1
    `, [user_id]);
    return res.status(200)
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json(new ApiResponse(200, "Logout successful"));
})
import jwt from "jsonwebtoken";
interface JwtPayload {
    id: number;
}
const generateAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(404, "Refresh token is invalid");
    }
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
    console.log(decodedToken);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(decodedToken.id);
    const payload = {
        httpOnly: true,
        sameSite: "strict" as const,
        secure: process.env.NODE_ENV === "production"
    }
    return res.status(200)
        .cookie("accessToken", accessToken, payload)
        .cookie("refreshToken", refreshToken, payload)
        .json(new ApiResponse(200, "access token regenerated successfully"));

})

export {
    signUp,
    login,
    logout,
    generateAccessToken
}