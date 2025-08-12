import mongoose from "mongoose";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res
        .status(400)
        .render("login", { message: "User already exists. Login to continue" });

    const newUser = await User.create(req.body);
    if (newUser)
      return res.status(201).render("login", {
        message: "User registered successfully. Please login to continue",
      });
  } catch (error) {
    res.status(500).json({ message: error || "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).render("login", { message: "User not found" });

    // // Store user in session so we can access it later
    // req.session.user = user;

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error || "Internal Server Error" });
  }
};
