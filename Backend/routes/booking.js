import express from "express";
import { createBooking, getUserBookings, getHostBookings, updateBookingStatus } from "../controllers/booking.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/user", protect, getUserBookings);

router.get("/host", protect, getHostBookings);

router.put("/:id/status", protect, updateBookingStatus);

export default router; 