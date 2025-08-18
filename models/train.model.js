import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String },
    trainName: { type: String },
    route: {
      startingStation: { type: String, required: true },
      endingStation: { type: String, required: true },
      arrivalTime: { type: String, required: true },
      departureTime: { type: String, required: true },
      betweenStations: [
        {
          stationName: { type: String, required: true },
          arrivalTime: { type: String },
          departureTime: { type: String },
        },
      ], // array of station names
    },
    seats: {
      AC_Sleeper: { type: Number },
      AC_Chair: { type: Number },
      AC_Seat: { type: Number }, // AC Cabin
      First_Sleeper: { type: Number },
      First_Chair: { type: Number },
      First_Seat: { type: Number }, // First Cabin
      General: { type: Number },
    },
  },
  { timestamps: true }
);

const Train = mongoose.model("Train", trainSchema);
export default Train;
