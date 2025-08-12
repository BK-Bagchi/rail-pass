import express from "express";

const authRouter = express.Router();
authRouter.get("/", (req, res) => {
  res.send("Auth route is working");
});

export default authRouter;
