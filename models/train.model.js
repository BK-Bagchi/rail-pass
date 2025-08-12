import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String },
    trainName: { type: String },
    route: [
      {
        stationName: { type: String },
        arrivalTime: { type: String },
        departureTime: { type: String },
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
