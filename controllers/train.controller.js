import Train from "../models/train.model.js";

export const getAllTrain = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");

  try {
    const allTrain = await Train.find();
    if (!allTrain || allTrain.length === 0) {
      return res.status(404).render("admin/dashboard", {
        trains: null,
        trainFound: "No trains found.",
        management: "trains",
      });
    }
    res.render("admin/dashboard", {
      trains: allTrain,
      trainFound: null,
      management: "trains",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const addNewTrain = async (req, res) => {
  try {
    // Create a new train instance
    const newTrain = await Train.create({
      trainNumber: req.body.trainNumber,
      trainName: req.body.trainName,
      route: [
        {
          startingStation: req.body.startingStation,
          endingStation: req.body.endingStation,
          arrivalTime: req.body.arrivalTime,
          departureTime: req.body.departureTime,
          betweenStations: req.body.betweenStations, // array of station names
        },
      ],
      seats: {
        AC_Sleeper: Number(req.body.AC_Sleeper),
        AC_Chair: Number(req.body.AC_Chair),
        AC_Seat: Number(req.body.AC_Seat),
        First_Sleeper: Number(req.body.First_Sleeper),
        First_Chair: Number(req.body.First_Chair),
        First_Seat: Number(req.body.First_Seat),
        General: Number(req.body.General),
      },
    });
    if (newTrain)
      return res.status(201).render("admin/dashboard", {
        management: "trains",
        trainAdded: "New train added successfully.",
      });
    else
      return res.status(400).render("admin/dashboard", {
        management: "trains",
        trainAdded: "Failed to add new train. Please try again.",
      });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
