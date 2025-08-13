import express from "express";
import { createBooking } from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

//✔ Booking Home Page
bookingRouter.get("/", (req, res) => {
  res.render("index", { notLogin: null });
});
//✔ Create Booking
bookingRouter.post("/", createBooking);
export default bookingRouter;
