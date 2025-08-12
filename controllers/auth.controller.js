import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res
        .status(400)
        .render("login", { message: "User already exists. Login to continue" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
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

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).render("login", { message: "Invalid password" });

    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error || "Internal Server Error" });
  }
};

export const logoutUser = (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) return res.status(500).json({ message: "Logout failed" });
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).json({ message: error || "Internal Server Error" });
  }
};
