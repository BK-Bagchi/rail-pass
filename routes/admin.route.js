import express from "express";
import { adminVerification } from "../controllers/admin.controller.js";
import {
  addNewTrain,
  deleteTrain,
  getAllTrain,
  updateTrain,
} from "../controllers/train.controller.js";
import {
  addNewStation,
  deleteStation,
  getAllStation,
  updateStation,
} from "../controllers/station.controller.js";
import User from "../models/user.model.js";
import { getAllUser, updateUser } from "../controllers/user.controller.js";

const adminRouter = express.Router();
//✔ Admin Login Page
adminRouter.get("/", (req, res) => {
  res.redirect("/admin/login");
});
adminRouter.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/admin/dashboard");
  res.render("admin/login", { userMissMatch: null, passwordMissMatch: null });
});
//✔ Admin Login post
adminRouter.post("/login", adminVerification);

//Admin Dashboard-----------------------------------------------
adminRouter.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  res.render("admin/dashboard", { management: "admin" });
});

// Admin User Management--------------------------------------
adminRouter.get("/users", getAllUser);
// Admin Add New User
adminRouter.post("/users/addUser", async (req, res) => {
  //not premissioned yet
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      role: req.body.role,
    });
    if (newUser) return res.status(201).redirect("/admin/users");
    else
      return res.status(400).redirect("/admin/users?error=Failed to add user");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});
// Admin Edit User
adminRouter.post("/users/editUser/:userId", updateUser);
// Admin Delete User
adminRouter.get("/users/deleteUser/:userId", async (req, res) => {
  //not premissioned yet
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (deletedUser)
      return res.redirect("/admin/users?success=User deleted successfully");
    else return res.redirect("/admin/users?error=Failed to delete user");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Admin Train Management -------------------------------------
adminRouter.get("/trains", getAllTrain);
// Admin Add New Train
adminRouter.post("/trains/addNewTrain", addNewTrain);
// Admin Edit Train
adminRouter.post("/trains/editTrain/:trainId", updateTrain);
// Admin Delete Train
adminRouter.get("/trains/deleteTrain/:trainId", deleteTrain);

//Admin Station Management-------------------------------------
adminRouter.get("/stations", getAllStation);
// Admin Add New Station
adminRouter.post("/stations/addStation", addNewStation);
// Admin Edit Station
adminRouter.post("/stations/editStation/:stationId", updateStation);
// Admin Delete Station
adminRouter.get("/stations/deleteStation/:stationId", deleteStation);

export default adminRouter;
