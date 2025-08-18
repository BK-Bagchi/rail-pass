import express from "express";
import {
  // checkTrainList,
  searchForTrain,
} from "../controllers/booking.controller.js";
import Station from "../models/station.model.js";

const bookingRouter = express.Router();

//✔ Booking Home Page. Search for Train
bookingRouter.get("/", searchForTrain);
// //✔ Check Train List
// bookingRouter.post("/checkTrainList", checkTrainList);
export default bookingRouter;
