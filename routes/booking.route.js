import express from "express";
import {
  showTrains,
  searchForTrain,
} from "../controllers/booking.controller.js";
import Station from "../models/station.model.js";

const bookingRouter = express.Router();

//✔ Booking Home Page. Search for Train
bookingRouter.get("/", searchForTrain);
//✔ Check Train List
bookingRouter.post("/showTrains", showTrains);
//✔ Select Seat by Type
bookingRouter.get("/selectSeat/:trainId", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/selectSeat", {
    trainId: req.params.trainId,
    trainName: req.query.train,
    seatClass: req.query.seatClass,
    fromStation: req.query.from,
    toStation: req.query.to,
    journeyDate: req.query.journeyDate,
  });
});
//✔ Confirm Booking
bookingRouter.get("/confirmBooking", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/confirmBooking");
});
export default bookingRouter;
