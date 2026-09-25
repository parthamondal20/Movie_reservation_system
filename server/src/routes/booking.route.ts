import { Router } from "express";
import { bookSeats, getBookings } from "../controllers/booking.controller";

const router = Router();
router.post("/bookSeats", bookSeats);
router.get("/getBookings/:userId", getBookings);
export default router;