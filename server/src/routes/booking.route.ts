import { Router } from "express";
import { bookSeats } from "../controllers/booking.controller";

const router = Router();
router.post("/bookSeats", bookSeats);
export default router;