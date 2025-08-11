import express from "express";
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

//Declare Route
app.get("/", (req, res) => {
  res.send("App is alive");
});
