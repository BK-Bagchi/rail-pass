import express from "express";
import { verifyTicket } from "../controllers/service.controller.js";
const serviceRouter = express.Router();

serviceRouter.get("/verify-ticket", (req, res) => {
  res.render("service/verifyTicket", { login: req.session.user });
});
serviceRouter.post("/verify-ticket", verifyTicket);

serviceRouter.get("/booking", (req, res) => {
  res.send("Service route:Booking is working");
});

serviceRouter.get("/seat-availability", (req, res) => {
  res.send("Service route:Seat Availability is working");
});

export default serviceRouter;
