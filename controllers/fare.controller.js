import Fare from "../models/fare.model.js";
import Train from "../models/train.model.js";

export const showAllFare = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const fares = await Fare.find();
    // if (!fares || fares.length === 0)
    //   return res.status(404).json({ message: "No fairs found" });

    const trainInfo = await Train.find().select("trainName seats"); //fetches TrainID(By default), TrainName, and seats
    // if (!trainInfo || trainInfo.length === 0)
    //   return res.status(404).json({ message: "No trains found" });

    res.render("admin/dashboard", {
      management: "fares",
      trains: trainInfo,
      fares: fares,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
