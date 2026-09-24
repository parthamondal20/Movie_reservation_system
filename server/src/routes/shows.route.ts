import { Router } from "express";
import { getShowsByMovieId, getShowById } from "../controllers/shows.controller";
const router = Router();
router.get("/details/:show_id", getShowById);
router.get("/:movie_id/:location", getShowsByMovieId);

export default router;