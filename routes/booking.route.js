import express from "express";
import {
  showTrains,
  searchForTrain,
  selectSeat,
  confirmBooking,
  doneForNow,
  success,
  downloadTicket,
} from "../controllers/booking.controller.js";
import {
  checkoutSuccess,
  createSSLCommerzSession,
} from "../controllers/paymentGetway.controller.js";

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
// bookingRouter.get("/success", checkoutSuccess);
bookingRouter.get("/success/:trainId", success);
// Handle the fail route
bookingRouter.get("/fail", (req, res) => res.send("failed"));
// Handle the cancel route
bookingRouter.get("/cancel", (req, res) => res.send("cancelled"));
//Download PDF ticket
bookingRouter.get("/downloadTicket/:pnr", downloadTicket);

export default bookingRouter;
