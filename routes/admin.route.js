import express from "express";
import { adminVerification } from "../controllers/admin.controller.js";
import {
  addNewTrain,
  deleteTrain,
  getAllTrain,
  updateTrain,
} from "../controllers/train.controller.js";
import Train from "../models/train.model.js";
import Station from "../models/station.model.js";

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
adminRouter.get("/stations", async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const allStations = await Station.find();
    console.log(allStations);
    if (!allStations || allStations.length === 0) {
      return res.status(404).render("admin/dashboard", {
        stations: null,
        stationFound: "No stations found. Please add some stations.",
        management: "stations",
      });
    }
    res.render("admin/dashboard", {
      stations: allStations,
      stationFound: null,
      management: "stations",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
// Admin Add New Station
adminRouter.post("/stations/addStation", async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const newStation = await Station.create({
      stationName: req.body.stationName,
      stationCode: req.body.stationCode,
      address: {
        district: req.body.district,
        division: req.body.division,
        subDivision: req.body.subDivision,
      },
    });
    if (newStation) return res.status(201).redirect("/admin/stations");
    else
      return res
        .status(400)
        .redirect("/admin/stations?error=Failed to add station");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

export default adminRouter;
