import express from "express";

const bookingRouter = express.Router();
bookingRouter.get("/", (req, res) => {
  res.send("Booking route is working");
});
export default bookingRouter;
