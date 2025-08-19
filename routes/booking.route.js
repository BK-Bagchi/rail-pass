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
bookingRouter.post("/selectSeat/:trainId", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  console.log(req.body);
  res.render("booking/selectSeat", {
    trainId: req.params.trainId,
    trainName: req.body.trainName,
    seatClass: req.body.seatClass,
    fromStation: req.body.fromStation,
    toStation: req.body.toStation,
    journeyDate: req.body.journeyDate,
  });
});
//✔ Confirm Booking
bookingRouter.get("/confirmBooking", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/confirmBooking");
});
export default bookingRouter;
