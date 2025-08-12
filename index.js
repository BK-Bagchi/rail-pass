import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import dbConnection from "./config/database.js";
import authRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.route.js";
import trainRouter from "./routes/train.route.js";

const app = express();
const port = 4000;
app.listen(port, () => {
  console.log(`✅ App is listening at port:${4000}`);
});

//Declare Middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Makes session available in EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

//Declare Route
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/auth", authRouter);
app.use("/booking", bookingRouter);
app.use("/train", trainRouter);

//Database Connection
// dbConnection();
