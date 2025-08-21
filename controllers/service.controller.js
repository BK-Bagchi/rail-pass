import Booking from "../models/booking.model.js";

export const verifyTicket = async (req, res) => {
  try {
    const pnr = req.body.pnr;
    if (!pnr || pnr.length !== 24)
      return res
        .status(404)
        .send(
          "<h1 style='text-align:center; margin-top:40vh;'>Ticket not found</h1>"
        );

    const ticketInfo = await Booking.findById(pnr)
      .populate("trainId")
      .populate("userId");

    if (!ticketInfo) return res.status(404).send("Ticket not found");
    res.render("success/success.ejs", {
      login: req.session.user,
      user: ticketInfo.userId,
      trainInfo: ticketInfo.trainId,
      bookingInfo: ticketInfo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
