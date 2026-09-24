import { Router } from "express";
import { getBookedSeats } from "../controllers/booked_seats.controller";

const router = Router();

router.get("/show/booked_seats/:show_id", getBookedSeats);

export default router;