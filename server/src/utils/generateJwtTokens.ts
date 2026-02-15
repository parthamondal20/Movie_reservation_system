import jwt, { SignOptions } from "jsonwebtoken";
import pool from "../configs/db";
const generateAccessAndRefreshTokens = async (id: number) => {
    const accessToken = jwt.sign(
        { id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" } as SignOptions
    );
    const refreshToken = jwt.sign(
        { id },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" } as SignOptions
    );
    await pool.query(
        `UPDATE users 
        SET refresh_token=$1
        WHERE id=$2
        `, [refreshToken, id]
    )
    return { accessToken, refreshToken };
};

export default generateAccessAndRefreshTokens;