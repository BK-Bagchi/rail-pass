import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String },
    trainName: { type: String },
    route: [
      {
        startingStation: { type: String, required: true },
        endingStation: { type: String, required: true },
        arrivalTime: { type: String, required: true },
        departureTime: { type: String, required: true },
        betweenStations: [{ type: String }], // array of station names
      },
    ],
    seats: {
      AC: { type: Number },
      Sleeper: { type: Number },
      General: { type: Number },
    },
  },
  { timestamps: true }
);

const Train = mongoose.model("Train", trainSchema);
export default Train;
