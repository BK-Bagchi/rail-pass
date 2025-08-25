import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    //prettier-ignore
    const { firstName, lastName, email, phone, dateOfBirth, location, district, division, postCode, password, confirmPassword,
    } = req.body;
    if (password !== confirmPassword)
      return res.status(400).render("auth/register", {
        login: req.session.user,
        userMissMatch: null,
        passwordMissMatch: "Passwords do not match",
      });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res.status(400).render("auth/login", {
        login: req.session.user,
        userMissMatch: "User already exists. Login to continue",
        passwordMissMatch: null,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    //prettier-ignore
    const newUser = await User.create({
      firstName,  lastName, email, phone, dateOfBirth, location, district, division, postCode,
      password: hashedPassword,
    });
    if (newUser)
      return res.status(201).render("auth/login", {
        login: req.session.user,
        userMissMatch: null,
        passwordMissMatch: null,
        message: "User registered successfully. Please login to continue",
      });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).render("auth/login", {
        userMissMatch: "User not found. Please register first.",
        passwordMissMatch: null,
      });

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).render("auth/login", {
        userMissMatch: null,
        passwordMissMatch: "Invalid password",
      });

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
