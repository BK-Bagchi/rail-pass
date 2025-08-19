import express from "express";
import {
  showTrains,
  searchForTrain,
  selectSeat,
} from "../controllers/booking.controller.js";
import Station from "../models/station.model.js";

const bookingRouter = express.Router();

//✔ Booking Home Page. Search for Train
bookingRouter.get("/", searchForTrain);
//✔ Check Train List
bookingRouter.post("/showTrains", showTrains);
//✔ Select Seat by Type
bookingRouter.post("/selectSeat/:trainId", selectSeat);
//✔ Confirm Booking
bookingRouter.get("/confirmBooking", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/confirmBooking");
});
export default bookingRouter;
