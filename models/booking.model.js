import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    train: { type: mongoose.Schema.Types.ObjectId, ref: "Train" },
    pnr: { type: String },
    seatClass: {
      type: { type: String },
      enum: [
        "AC_Sleeper",
        "AC_Chair",
        "AC_Seat", //AC Cabin
        "First_Sleeper",
        "First_Chair",
        "First_Seat", //First Cabin
        "General",
      ],
      default: "General",
    },
    seatNumber: [{ type: String }],
    confirmationDate: { type: Date },
    journeyDate: { type: Date },
    formStation: { type: String },
    toStation: { type: String },
    totalFare: { type: Number },
    status: {
      type: { type: String },
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
