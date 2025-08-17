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
    if (newTrain) return res.status(201).redirect("/admin/trains");
    else
      return res
        .status(400)
        .redirect("/admin/trains?error=Failed to add train");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateTrain = async (req, res) => {
  const { trainId } = req.params;

  try {
    const updatedData = await Train.findByIdAndUpdate(
      trainId,
      {
        trainNumber: req.body.trainNumber,
        trainName: req.body.trainName,
        route: [
          {
            startingStation: req.body.startingStation,
            endingStation: req.body.endingStation,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            // betweenStations: req.body.betweenStations, // array of station names
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
      },
      { new: true }
    );

    if (updatedData)
      return res.redirect("/admin/trains?success=Train updated successfully");
    else return res.redirect("/admin/trains?error=Failed to update train");
  } catch (error) {
    console.error("Edit Train Error:", error);
    return res.redirect(
      "/admin/trains?error=" + encodeURIComponent(error.message)
    );
  }
};

export const deleteTrain = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");

  try {
    const { trainId } = req.params;
    const deleteTrain = await Train.findByIdAndDelete(trainId);

    if (deleteTrain)
      return res.redirect("/admin/trains?success=Train deleted successfully");
    else return res.redirect("/admin/trains?error=Train not found");
  } catch (error) {
    console.error("Delete Train Error:", error);
    return res.redirect(
      "/admin/trains?error=" +
        encodeURIComponent(error.message || "Internal Server Error")
    );
  }
};
