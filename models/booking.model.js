import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trainId: { type: mongoose.Schema.Types.ObjectId, ref: "Train" },
    seatClass: {
      type: String,
      enum: [
        "AC_Sleeper",
        "AC_Chair",
        "AC_Seat", // AC Cabin
        "First_Sleeper",
        "First_Chair",
        "First_Seat", // First Cabin
        "General",
      ],
      default: "General",
    },
    seatNumber: [{ type: String }],
    confirmationDate: { type: Date },
    journeyDate: { type: Date },
    fromStation: { type: String },
    departureTime: { type: String },
    toStation: { type: String },
    arrivalTime: { type: String },
    totalFare: { type: Number },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
