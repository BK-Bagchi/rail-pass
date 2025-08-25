import Station from "../models/station.model.js";
import Train from "../models/train.model.js";

export const getAllTrain = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    const allTrain = await Train.find().sort({ trainName: 1 });
    if (!allTrain || allTrain.length === 0) {
      return res.status(404).render("admin/dashboard", {
        login: req.session.user,
        trains: null,
        trainFound: "No trains found.",
        management: "trains",
      });
    }
    res.render("admin/dashboard", {
      login: req.session.user,
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
  if (!req.session.user) return res.redirect("/admin/login");
  try {
    // prettier-ignore
    const { trainNumber, trainName, startingStation, endingStation, arrivalTime, departureTime, AC_Sleeper, AC_Chair, AC_Seat, First_Sleeper, First_Chair, First_Seat, General, ...rest } = req.body;

    // Transform flat betweenStations keys into array of objects
    const betweenStations = [];
    Object.keys(rest).forEach((key) => {
      const match = key.match(/betweenStations\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        const value = rest[key];

        // Only assign if value is not null, undefined, or empty string
        if (value !== null && value !== undefined && value !== "") {
          if (!betweenStations[index]) betweenStations[index] = {};
          betweenStations[index][field] = value;
        }
      }
    });

    // Remove any empty objects that might remain
    const filteredStations = betweenStations.filter(
      (station) => Object.keys(station).length > 0
    );

    // Add starting and ending stations in the station model
    filteredStations.unshift({
      stationName: startingStation,
      arrivalTime: "",
      departureTime: "",
    });
    filteredStations.push({
      stationName: endingStation,
      arrivalTime: "",
      departureTime: "",
    });

    // Between stations are inserted into the Station model
    const stationsToInsert = filteredStations
      .filter(
        (station) => station.stationName && station.stationName.trim() !== ""
      )
      .map((station) => ({
        stationName: station.stationName,
        stationCode: "",
        address: {
          district: "",
          division: "",
          subDivision: "",
        },
      }));

    // Insert all stations at once which station names are not already in the database
    // This prevents duplicate station entries
    if (stationsToInsert.length > 0) {
      // Get names of existing stations
      const existingStationNames = await Station.find(
        { stationName: { $in: stationsToInsert.map((s) => s.stationName) } },
        { stationName: 1, _id: 0 }
      ).lean();

      const existingNamesSet = new Set(
        existingStationNames.map((s) => s.stationName)
      );
      const newStations = stationsToInsert.filter(
        (s) => !existingNamesSet.has(s.stationName)
      );
      if (newStations.length > 0) {
        await Station.insertMany(newStations);
      }
    }

    // Create new train
    const newTrain = await Train.create({
      trainNumber,
      trainName,
      route: {
        startingStation,
        endingStation,
        arrivalTime,
        departureTime,
        betweenStations: filteredStations,
      },
      seats: {
        AC_Sleeper: Number(AC_Sleeper),
        AC_Chair: Number(AC_Chair),
        AC_Seat: Number(AC_Seat),
        First_Sleeper: Number(First_Sleeper),
        First_Chair: Number(First_Chair),
        First_Seat: Number(First_Seat),
        General: Number(General),
      },
    });

    if (newTrain)
      return res
        .status(201)
        .redirect("/admin/trains?success=Train added successfully");
    else
      return res
        .status(400)
        .redirect("/admin/trains?error=Failed to add train");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateTrain = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");
  const { trainId } = req.params;
  try {
    // prettier-ignore
    const { trainNumber, trainName, startingStation, endingStation, arrivalTime, departureTime, AC_Sleeper, AC_Chair, AC_Seat, First_Sleeper, First_Chair, First_Seat, General, ...rest } = req.body;

    // Transform flat betweenStations keys into array of objects
    const betweenStations = [];
    Object.keys(rest).forEach((key) => {
      const match = key.match(/betweenStations\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        const value = rest[key];

        // Only assign if value is not null, undefined, or empty string
        if (value !== null && value !== undefined && value !== "") {
          if (!betweenStations[index]) betweenStations[index] = {};
          betweenStations[index][field] = value;
        }
      }
    });

    // Remove any empty objects that might remain
    const filteredStations = betweenStations.filter(
      (station) => Object.keys(station).length > 0
    );

    // Add starting and ending stations in the station model
    filteredStations.unshift({
      stationName: startingStation,
      arrivalTime: "",
      departureTime: "",
    });
    filteredStations.push({
      stationName: endingStation,
      arrivalTime: "",
      departureTime: "",
    });

    // Between stations are inserted into the Station model
    const stationsToInsert = filteredStations
      .filter(
        (station) => station.stationName && station.stationName.trim() !== ""
      )
      .map((station) => ({
        stationName: station.stationName,
        stationCode: "",
        address: {
          district: "",
          division: "",
          subDivision: "",
        },
      }));

    // Insert all stations at once which station names are not already in the database
    // This prevents duplicate station entries
    if (stationsToInsert.length > 0) {
      // Get names of existing stations
      const existingStationNames = await Station.find(
        { stationName: { $in: stationsToInsert.map((s) => s.stationName) } },
        { stationName: 1, _id: 0 }
      ).lean();

      const existingNamesSet = new Set(
        existingStationNames.map((s) => s.stationName)
      );
      const newStations = stationsToInsert.filter(
        (s) => !existingNamesSet.has(s.stationName)
      );
      if (newStations.length > 0) {
        await Station.insertMany(newStations);
      }
    }

    // Update train with new data
    const updatedData = await Train.findByIdAndUpdate(
      trainId,
      {
        trainNumber,
        trainName,
        route: {
          startingStation,
          endingStation,
          arrivalTime,
          departureTime,
          betweenStations: filteredStations,
        },
        seats: {
          AC_Sleeper: Number(AC_Sleeper),
          AC_Chair: Number(AC_Chair),
          AC_Seat: Number(AC_Seat),
          First_Sleeper: Number(First_Sleeper),
          First_Chair: Number(First_Chair),
          First_Seat: Number(First_Seat),
          General: Number(General),
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
