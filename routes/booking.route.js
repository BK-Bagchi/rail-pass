import express from "express";
import {
  showTrains,
  searchForTrain,
  selectSeat,
  confirmBooking,
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
bookingRouter.post("/confirmBooking", confirmBooking);
export default bookingRouter;
