import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
export interface JwtPayload {
    id: number;
}
const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new ApiError(404, "Access token missing");
        }
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        req.user = decodedToken;
        next();
    } catch (error) {
        next(new ApiError(404, "Invalid or expired token"));
    }
}

export default authenticateMiddleware;