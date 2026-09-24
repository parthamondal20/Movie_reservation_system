import { Router } from "express";
import { getSeatsByScreenId, getSeatsByShowId } from "../controllers/seats.controller";

const router = Router();

// GET /api/v1/seats/show/:show_id — seats for a specific show
router.get("/show/:show_id", getSeatsByShowId);

// GET /api/v1/seats/:screen_id — seats for a specific screen
router.get("/:screen_id", getSeatsByScreenId);

export default router;
