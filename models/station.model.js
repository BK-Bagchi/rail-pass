import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    stationName: { type: String },
    stationCode: { type: String },
    address: {
      district: { type: String },
      division: { type: String },
      subDivision: { type: String },
    },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);
export default Station;
