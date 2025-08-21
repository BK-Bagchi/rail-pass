import express from "express";
import {
  showTrains,
  searchForTrain,
  selectSeat,
  confirmBooking,
  doneForNow,
} from "../controllers/booking.controller.js";
import Station from "../models/station.model.js";
import {
  checkoutSuccess,
  createSSLCommerzSession,
} from "../controllers/paymentGetway.controller.js";
import Booking from "../models/booking.model.js";

const bookingRouter = express.Router();

//✔ Booking Home Page. Search for Train
bookingRouter.get("/", searchForTrain);
//✔ Check Train List
bookingRouter.post("/showTrains", showTrains);
//✔ Select Seat by Type
bookingRouter.post("/selectSeat/:trainId", selectSeat);
//✔ Confirm Booking
bookingRouter.post("/confirmBooking", confirmBooking);
//✔ Done for Now. Payment GetWay will be added later
bookingRouter.post("/doneForNow", doneForNow);

//✔ Proceed to Payment GetWay
bookingRouter.post("/create-sslcommerz-session", createSSLCommerzSession);
// Handle the success route

// Handle the fail route
bookingRouter.get("/fail", (req, res) => res.send("failed"));

// Handle the cancel route
bookingRouter.get("/cancel", (req, res) => res.send("cancelled"));

export default bookingRouter;
