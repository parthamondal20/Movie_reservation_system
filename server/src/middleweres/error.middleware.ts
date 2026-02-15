import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json(
        {
            success: false,
            message: err.message,
            errors: err.errors || [],
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        }
    )
}

export default errorMiddleware;