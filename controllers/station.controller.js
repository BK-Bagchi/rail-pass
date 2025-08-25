import Station from "../models/station.model.js";

export const getAllStation = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const allStations = await Station.find().sort({ stationName: 1 });
    if (!allStations || allStations.length === 0) {
      return res.status(404).render("admin/dashboard", {
        login: req.session.user,
        stations: null,
        stationFound: "No stations found. Please add some stations.",
        management: "stations",
      });
    }
    res.render("admin/dashboard", {
      login: req.session.user,
      stations: allStations,
      stationFound: null,
      management: "stations",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const addNewStation = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const newStation = await Station.create({
      stationName: req.body.stationName,
      stationCode: req.body.stationCode,
      address: {
        district: req.body.district,
        division: req.body.division,
        subDivision: req.body.subDivision,
      },
    });
    if (newStation) return res.status(201).redirect("/admin/stations");
    else
      return res
        .status(400)
        .redirect("/admin/stations?error=Failed to add station");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateStation = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.stationId,
      {
        stationName: req.body.stationName,
        stationCode: req.body.stationCode,
        address: {
          district: req.body.district,
          division: req.body.division,
          subDivision: req.body.subDivision,
        },
      },
      { new: true }
    );
    if (updatedStation)
      return res.redirect(
        "/admin/stations?success=Station updated successfully"
      );
    else return res.redirect("/admin/stations?error=Failed to update station");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteStation = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const deletedStation = await Station.findByIdAndDelete(
      req.params.stationId
    );
    if (deletedStation)
      return res.redirect(
        "/admin/stations?success=Station deleted successfully"
      );
    else return res.redirect("/admin/stations?error=Failed to delete station");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
