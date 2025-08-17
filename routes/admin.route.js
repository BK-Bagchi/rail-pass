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

//Admin Dashboard
adminRouter.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  res.render("admin/dashboard", { management: "admin" });
});

// Admin User Management
adminRouter.get("/users", (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  res.render("admin/dashboard", { management: "users" });
});

// Admin Train Management
adminRouter.get("/trains", getAllTrain);
// Admin Add New Train
adminRouter.post("/trains/addNewTrain", addNewTrain);
// Admin Edit Train
adminRouter.post("/trains/editTrain/:trainId", updateTrain);
// Admin Delete Train
adminRouter.get("/trains/deleteTrain/:trainId", deleteTrain);

//Admin Station Management
adminRouter.get("/stations", getAllStation);
// Admin Add New Station
adminRouter.post("/stations/addStation", addNewStation);
// Admin Edit Station
adminRouter.post("/stations/editStation/:stationId", updateStation);
// Admin Delete Station
adminRouter.get("/stations/deleteStation/:stationId", deleteStation);

export default adminRouter;
