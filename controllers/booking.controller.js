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
