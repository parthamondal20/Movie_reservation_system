import { Router } from "express";
import { getShowsByMovieId } from "../controllers/shows.controller";
const router = Router();
router.get("/:movie_id/:location", getShowsByMovieId);

export default router;