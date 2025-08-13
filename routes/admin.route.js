import express from "express";
import { adminVerification } from "../controllers/admin.controller.js";

const adminRouter = express.Router();
//✔ Admin Login Page
adminRouter.get("/login", (req, res) => {
  res.render("admin/login", { userMissMatch: null, passwordMissMatch: null });
});
//✔ Admin Login post
adminRouter.post("/login", adminVerification);

export default adminRouter;
