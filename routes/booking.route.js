import express from "express";
import {
  showTrains,
  searchForTrain,
  selectSeat,
  confirmBooking,
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
//✔ Proceed to Payment
bookingRouter.post("/payment", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    console.log(req.body);
    console.log(req.session.user);
    res.send("Payment Page");
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
});

//✔ Proceed to Payment GetWay
bookingRouter.post("/create-sslcommerz-session", createSSLCommerzSession);
// Handle the success route
bookingRouter.get("/success", checkoutSuccess);

// Handle the fail route
bookingRouter.get("/fail", (req, res) => res.send("failed"));

// Handle the cancel route
bookingRouter.get("/cancel", (req, res) => res.send("cancelled"));

export default bookingRouter;
