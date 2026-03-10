import { Router } from "express";
import { addMovie } from "../controllers/movie.controller";
const router = Router();

router.post("/add", addMovie);

export default router;