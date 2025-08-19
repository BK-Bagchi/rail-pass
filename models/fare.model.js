import mongoose from "mongoose";

const fareSchema = new mongoose.Schema(
  {
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    fareDetails: {
      AC_Sleeper: { type: Number, default: 0 },
      AC_Chair: { type: Number, default: 0 },
      AC_Seat: { type: Number, default: 0 }, // AC Cabin
      First_Sleeper: { type: Number, default: 0 },
      First_Chair: { type: Number, default: 0 },
      First_Seat: { type: Number, default: 0 }, // First Cabin
      General: { type: Number, default: 0 },
    },
    farePerKilometer: {
      AC_Sleeper: { type: Number, default: 0 },
      AC_Chair: { type: Number, default: 0 },
      AC_Seat: { type: Number, default: 0 }, // AC Cabin
      First_Sleeper: { type: Number, default: 0 },
      First_Chair: { type: Number, default: 0 },
      First_Seat: { type: Number, default: 0 }, // First Cabin
      General: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Fare = mongoose.model("Fare", fareSchema);
export default Fare;
