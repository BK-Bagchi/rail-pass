import express from "express";
import { adminVerification } from "../controllers/admin.controller.js";
import { addNewTrain, getAllTrain } from "../controllers/train.controller.js";

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

export default adminRouter;
