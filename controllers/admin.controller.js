import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const adminVerification = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.role !== "admin")
      return res.status(404).render("auth/login", {
        login: req.session.user,
        userMissMatch: "You are not an registered Admin.",
        passwordMissMatch: null,
      });

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).render("auth/login", {
        login: req.session.user,
        userMissMatch: null,
        passwordMissMatch: "Incorrect password. Please try again.",
      });

    req.session.user = user;
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
