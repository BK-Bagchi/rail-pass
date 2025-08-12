import express from "express";

const trainRouter = express.Router();
trainRouter.get("/", (req, res) => {
  res.send("Train route is working");
});
export default trainRouter;
