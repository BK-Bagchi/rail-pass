import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    dateOfBirth: { type: Date },
    address: {
      location: { type: String },
      district: { type: String },
      division: { type: String },
      postCode: { type: String },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
