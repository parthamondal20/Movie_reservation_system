import { Router } from "express";
import { getMovieById, getMovies } from "../controllers/movie.controller";

const router = Router();

router.get("/get/:lastId/:limit", getMovies);
router.get("/:movie_id",getMovieById);
export default router;
