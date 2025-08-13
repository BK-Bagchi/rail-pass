import Booking from "../models/booking.model.js";

export const createBooking = async (req, res) => {
  try {
    if (!req.session)
      return res
        .status(401)
        .render("index", { notLogin: "Unauthorized. Please login." });

    console.log(req.body);
    // const bookingData = req.body;
    // bookingData.user = req.session.userId; // Assuming userId is stored in session
    // const newBooking = await Booking.create(bookingData);
    // res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
