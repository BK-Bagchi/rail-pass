import e from "express";
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

export const showTrains = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    //Define fares for each seat class
    // This will be moved to a config file or database later
    // For now, hardcoding the fares
    const fares = {
      AC_Sleeper: 1500,
      AC_Chair: 1000,
      AC_Seat: 800,
      First_Sleeper: 600,
      First_Chair: 500,
      First_Seat: 400,
      General: 200,
    };
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
      return res.status(404).render("booking/showTrains", {
        trains: null,
        trainFound: "No trains found for the selected route.",
        fromStation: null,
        toStation: null,
        seatClass: null,
        journeyDate: null,
      });

    res.render("booking/showTrains", {
      trains: getAllTrains,
      trainFound: null,
      fromStation,
      toStation,
      seatClass,
      journeyDate,
      fares,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const selectSeat = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/selectSeat", {
    trainId: req.params.trainId,
    trainName: req.body.trainName,
    seatClass: req.body.seatClass,
    fromStation: req.body.fromStation,
    toStation: req.body.toStation,
    journeyDate: req.body.journeyDate,
  });
};

export const confirmBooking = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    // prettier-ignore
    const { trainId, trainName, seatClass, fromStation, toStation, journeyDate, totalSeats, selectedSeats } = req.body;
    // prettier-ignore
    res.render("booking/confirmBooking", { trainId, trainName, seatClass, fromStation, toStation, journeyDate, totalSeats, selectedSeats,});
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
