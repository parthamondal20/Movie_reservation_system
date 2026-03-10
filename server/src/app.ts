import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import passport from "./configs/passport";
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize());
const allowedOrigins = [
    process.env.ADMIN_URL,
    process.env.CLIENT_URL,
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

import errorMiddleware from "./middleweres/error.middleware";
import authenticateMiddleware from "./middleweres/authenticate.middleware";
import authRoutes from "./routes/auth.route";
import movieRoutes from "./routes/movie.route";
import userRoutes from "./routes/user.route";
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use(authenticateMiddleware);
app.use("/api/v1/user", userRoutes);

import adminMovieRoutes from "./admin/routes/movie.route";
app.use("/api/v1/admin/movie", adminMovieRoutes);


app.use(errorMiddleware);
export default app;