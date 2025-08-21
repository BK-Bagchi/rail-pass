import e from "express";
import Station from "../models/station.model.js";
import Train from "../models/train.model.js";
import Fare from "../models/fare.model.js";

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

    //---------------This part is to calculate how many stations are in the journey----------------
    const journeyStationsList = getAllTrains
      .map((train) => {
        const route = train.route;
        const allStations = [
          { name: route.startingStation },
          ...(route.betweenStations || []).map((st) => ({
            name: st.stationName,
          })),
          { name: route.endingStation },
        ];
        const fromIndex = allStations.findIndex(
          (st) => st.name === fromStation
        );
        const toIndex = allStations.findIndex((st) => st.name === toStation);

        // If both stations exist and from < to
        if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
          const journeyStations = allStations.slice(fromIndex, toIndex + 1);
          return {
            journeyStations,
          };
        } else return null;
      })
      .filter((t) => t !== null);
    const journeyLengths = journeyStationsList.map(
      (train) => train.journeyStations.length
    );
    // console.log(journeyLengths[0]);
    //---------------This part is to calculate how many stations are in the journey----------------

    const trainsWithFares = await Promise.all(
      getAllTrains.map(async (train) => {
        const fare = await Fare.findOne({ trainId: train._id }); // fetch fare
        return { ...train.toObject(), fare };
      })
    );

    if (!trainsWithFares || trainsWithFares.length === 0)
      return res.status(404).render("booking/showTrains", {
        login: req.session.user,
        trains: null,
        trainFound: "No trains found for the selected route.",
        fromStation: null,
        toStation: null,
        seatClass: null,
        journeyDate: null,
      });

    res.render("booking/showTrains", {
      login: req.session.user,
      trains: trainsWithFares,
      trainFound: null,
      fromStation,
      toStation,
      seatClass,
      journeyDate,
      journeyStations: journeyLengths[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const selectSeat = async (req, res) => {
  // if (!req.session.user) return res.redirect("/auth/login");
  res.render("booking/selectSeat", {
    login: req.session.user,
    trainId: req.params.trainId,
    journeyInfo: req.body,
  });
};

export const confirmBooking = async (req, res) => {
  // if (!req.session.user) return res.redirect("/auth/login");
  try {
    res.render("booking/confirmBooking", {
      login: req.session.user,
      bookingDetails: req.body,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
