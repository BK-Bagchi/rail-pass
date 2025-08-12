import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Database connection
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB database connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export default dbConnection;
