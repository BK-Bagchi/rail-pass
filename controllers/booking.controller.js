import Station from "../models/station.model.js";

export const searchForTrain = async (req, res) => {
  try {
    const allStations = await Station.find();
    if (!allStations)
      return res
        .status(404)
        .render("index", { login: req.session.user, stations: null });

    res.render("index", { login: req.session.user, stations: allStations });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// export const checkTrainList = async (req, res) => {
//   if (!req.session.user) return res.redirect("/auth/login");
//   try {
//     console.log("Checking train list with data:", req.body);
//     res.send("Train list checked successfully");
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal Server Error" });
//   }
// };
