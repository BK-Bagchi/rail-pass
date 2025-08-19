import express from "express";
import {
  checkTrainList,
  searchForTrain,
} from "../controllers/booking.controller.js";
import Station from "../models/station.model.js";

const bookingRouter = express.Router();

//✔ Booking Home Page. Search for Train
bookingRouter.get("/", searchForTrain);
//✔ Check Train List
bookingRouter.post("/checkTrainList", checkTrainList);
//✔ Select Seat by Type
bookingRouter.get("/selectSeat/:trainId", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/selectSeat", {
    trainId: req.params.trainId,
    seatType: req.query.seatType,
  });
});
export default bookingRouter;
