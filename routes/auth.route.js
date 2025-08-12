import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// ✔ User Login
authRouter.get("/login", (req, res) => {
  res.render("auth/login", { message: null });
});
authRouter.post("/login", loginUser);

// ✔ User Logout
// This route will destroy the session and redirect to the home page
authRouter.get("/logout", logoutUser);

// ✔ User Registration
authRouter.get("/register", (req, res) => {
  res.render("auth/register", { message: null });
});
authRouter.post("/register", registerUser);

export default authRouter;
