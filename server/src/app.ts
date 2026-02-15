import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

import authRoutes from "./routes/auth.route";
import errorMiddleware from "./middleweres/error.middleware";
app.use("/api/v1/auth", authRoutes);
app.use(errorMiddleware);
export default app;