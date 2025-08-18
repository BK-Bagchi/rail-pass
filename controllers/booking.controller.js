import Station from "../models/station.model.js";
import Train from "../models/train.model.js";

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

export const checkTrainList = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    // console.log("Checking train list with data:", req.body); formStation, toStation, seatClass, journeyDate
    const { fromStation, toStation, seatClass, journeyDate } = req.body;
    const getAllTrains = await Train.find({
      $and: [
        {
          $or: [
            { "route.startingStation": fromStation },
            { "route.betweenStations.stationName": fromStation },
          ],
        },
        {
          $or: [
            { "route.endingStation": toStation },
            { "route.betweenStations.stationName": toStation },
          ],
        },
      ],
    }).sort({ trainName: 1 });

    if (!getAllTrains || getAllTrains.length === 0)
      return res.status(404).render("booking/selectTrain", {
        trains: null,
        trainFound: "No trains found for the selected route.",
        fromStation: null,
        toStation: null,
        seatClass: null,
        journeyDate: null,
      });

    res.render("booking/selectTrain", {
      trains: getAllTrains,
      trainFound: null,
      fromStation,
      toStation,
      seatClass,
      journeyDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
