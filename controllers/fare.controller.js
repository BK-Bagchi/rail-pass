import Fare from "../models/fare.model.js";
import Train from "../models/train.model.js";

export const showAllFare = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const fares = await Fare.find().populate({
      path: "trainId", // matches the ref in Fare schema
      select: "trainName trainNumber seats", // only fetch required fields
    });
    fares.sort((a, b) => {
      if (!a.trainId || !b.trainId) return 0;
      return a.trainId.trainName.localeCompare(b.trainId.trainName);
    });

    // if (!fares || fares.length === 0)
    //   return res.status(404).json({ message: "No fairs found" });

    const trainInfo = await Train.find().select("trainName seats"); //fetches TrainID(By default), TrainName, and seats
    // if (!trainInfo || trainInfo.length === 0)
    //   return res.status(404).json({ message: "No trains found" });

    res.render("admin/dashboard", {
      login: req.session.user,
      management: "fares",
      trains: trainInfo,
      fares: fares,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const addNewFare = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const newFareList = await Fare.create({
      trainId: req.body.trainId,
      farePerKilometer: {
        AC_Sleeper: req.body.AC_Sleeper,
        AC_Chair: req.body.AC_Chair,
        AC_Seat: req.body.AC_Seat, // AC Cabin
        First_Sleeper: req.body.First_Sleeper,
        First_Chair: req.body.First_Chair,
        First_Seat: req.body.First_Seat, // First Cabin
        General: req.body.General,
      },
    });
    if (newFareList) return res.status(201).redirect("/admin/fares");
    else
      return res.status(400).redirect("/admin/fares?error=Failed to add fare");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateFare = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    //prettier-ignore
    const updatedFare = await Fare.findByIdAndUpdate(
      req.params.fareId,
      {
        farePerKilometer: {
          AC_Sleeper: req.body.AC_Sleeper,
          AC_Chair: req.body.AC_Chair,
          AC_Seat: req.body.AC_Seat, // AC Cabin
          First_Sleeper: req.body.First_Sleeper,
          First_Chair: req.body.First_Chair,
          First_Seat: req.body.First_Seat, // First Cabin
          General: req.body.General,
        },
      },
      { new: true }
    );
    if (updatedFare)
      return res.redirect("/admin/fares?success=Fare updated successfully");
    else return res.redirect("/admin/fares?error=Failed to update fare");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteFare = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const deleteFare = await Fare.findByIdAndDelete(req.params.fareId);
    if (deleteFare)
      return res.redirect("/admin/fares?success=Fare delete successfully");
    else return res.redirect("/admin/fares?error=Failed to delete fare");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
