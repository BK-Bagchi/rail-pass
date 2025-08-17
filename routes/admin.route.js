import express from "express";
import { adminVerification } from "../controllers/admin.controller.js";
import {
  addNewTrain,
  deleteTrain,
  getAllTrain,
} from "../controllers/train.controller.js";
import Train from "../models/train.model.js";

const adminRouter = express.Router();
//✔ Admin Login Page
adminRouter.get("/", (req, res) => {
  res.redirect("/admin/login");
});
adminRouter.get("/login", (req, res) => {
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
adminRouter.post("/trains/editTrain", (req, res) => {
  // Logic for editing a train will go here
  res.status(501).send("Edit Train functionality not implemented yet.");
});
// Admin Delete Train
adminRouter.get("/trains/deleteTrain/:trainId", deleteTrain);

export default adminRouter;
