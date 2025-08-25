import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import Station from "../models/station.model.js";
import Train from "../models/train.model.js";
import Fare from "../models/fare.model.js";
import Booking from "../models/booking.model.js";

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

    if (!getAllTrains || getAllTrains.length === 0) {
      return res.status(404).render("booking/showTrains", {
        login: req.session.user,
        trains: null,
        trainFound: "No trains found for the selected route.",
        fromStation,
        toStation,
        seatClass,
        journeyDate,
      });
    }

    const trainIds = getAllTrains.map((train) => train._id);
    // ✅ Get bookings for those trains on this date
    const getAllBookings = await Booking.find({
      trainId: { $in: trainIds },
      journeyDate,
    });

    // ✅ Calculate journey length
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

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
          const journeyStations = allStations.slice(fromIndex, toIndex + 1);
          return { journeyStations };
        }
        return null;
      })
      .filter((t) => t !== null);

    const journeyLengths = journeyStationsList.map(
      (train) => train.journeyStations.length
    );

    // ✅ Attach fares and remaining seats
    const trainsWithRemaining = await Promise.all(
      getAllTrains.map(async (train) => {
        const fare = await Fare.findOne({ trainId: train._id });

        // Clone
        const updatedTrain = { ...(train.toObject?.() || train) };
        updatedTrain.fare = fare;
        updatedTrain.remainingSeats = { ...train.seats };

        // Apply bookings
        getAllBookings.forEach((booking) => {
          if (booking.trainId.toString() === train._id.toString()) {
            const bookedClass = booking.seatClass;
            const bookedCount = booking.seatNumber.length;

            updatedTrain.remainingSeats[bookedClass] =
              (updatedTrain.remainingSeats[bookedClass] || 0) - bookedCount;
          }
        });

        return updatedTrain;
      })
    );

    // ✅ Render with correct trains data
    res.render("booking/showTrains", {
      login: req.session.user,
      trains: trainsWithRemaining,
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
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    const seatInfo = await Train.findOne(
      {
        _id: req.params.trainId,
        [`seats.${req.body.seatClass}`]: { $gt: 0 },
      },
      { [`seats.${req.body.seatClass}`]: 1, _id: 0 }
    );
    const totalSeats = seatInfo.seats[req.body.seatClass];
    const findBookedSeat = await Booking.find({
      trainId: req.params.trainId,
      journeyDate: req.body.journeyDate,
    });
    const bookedSeats = findBookedSeat.flatMap((seat) => seat.seatNumber);
    res.render("booking/selectSeat", {
      login: req.session.user,
      trainId: req.params.trainId,
      journeyInfo: { ...req.body, totalSeats, bookedSeats },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const confirmBooking = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
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

export const doneForNow = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    const today = new Date();
    const confirmationDate = today.toISOString().split("T")[0];
    let selectedSeats = req.body.selectedSeats;
    const seatNumber = selectedSeats
      .split(",") // split by comma
      .map((s) => s.trim()) // remove any extra spaces
      .filter((s) => s); // remove empty strings

    const bookingDetails = {
      userId: req.session.user._id,
      trainId: req.body.trainId,
      seatClass: req.body.seatClass,
      seatNumber: seatNumber,
      confirmationDate: confirmationDate,
      journeyDate: req.body.journeyDate,
      fromStation: req.body.fromStation,
      departureTime: req.body.departureTime,
      toStation: req.body.toStation,
      arrivalTime: req.body.arrivalTime,
      totalFare: Number(req.body.fare),
      status: "confirmed",
    };

    const createBooking = await Booking.create(bookingDetails);
    if (createBooking)
      return res
        .status(201)
        .redirect(
          `/booking/success/${req.body.trainId}?journeyDate=${req.body.journeyDate}`
        );
    else res.status(400).redirect("/booking/fail");
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const success = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    const user = req.session.user;
    const trainInfo = await Train.findById(req.params.trainId);
    const bookingInfo = await Booking.findOne({
      trainId: req.params.trainId,
      journeyDate: new Date(req.query.journeyDate),
    });
    if (!bookingInfo) return res.redirect(`/booking/fail`);
    res.render("success/success.ejs", {
      login: req.session.user,
      user: user,
      trainInfo: trainInfo,
      bookingInfo: bookingInfo,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.pnr)
      .populate("trainId")
      .populate("userId");

    if (!booking) return res.status(404).send("Booking not found");

    // Generate QR Code (encode PNR + journey info)
    const qrData = `PNR: ${booking._id}\nPassenger: ${
      booking.userId.firstName
    } ${booking.userId.lastName}\nTrain: ${booking.trainId.trainName} (${
      booking.trainId.trainNumber
    })\nJourney: ${new Date(booking.journeyDate).toDateString()}`;
    const qrImage = await QRCode.toDataURL(qrData);
    // Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="RailPass_${booking._id}.pdf"`
    );
    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .fillColor("#2E86C1")
      .text("Rail Pass Train Journey Ticket", {
        align: "center",
        underline: true,
      });
    doc.moveDown(2);

    // 📌 Ticket Details Box
    doc
      .rect(40, 100, 520, 300) // x, y, width, height
      .stroke("#2E86C1");
    doc.fontSize(12).fillColor("black");
    let y = 120;
    const lineGap = 25;

    const addField = (label, value) => {
      doc.font("Helvetica-Bold").text(label, 60, y);
      doc.font("Helvetica").text(value, 200, y);
      y += lineGap;
    };

    // Ticket Info
    addField("PNR:", booking._id.toString());
    addField(
      "Passenger:",
      `${booking.userId.firstName} ${booking.userId.lastName}`
    );
    addField(
      "Train:",
      `${booking.trainId.trainName} (${booking.trainId.trainNumber})`
    );
    addField("From:", booking.fromStation);
    addField("To:", booking.toStation);
    addField("Departure:", booking.departureTime);
    addField("Arrival:", booking.arrivalTime);
    addField(
      "Confirmation Date:",
      new Date(booking.confirmationDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    addField(
      "Journey Date:",
      new Date(booking.journeyDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    addField(
      "Seat:",
      `${booking.seatClass} - ${booking.seatNumber.join(", ")}`
    );
    addField(
      "Status:",
      booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    );
    addField("Fare:", `${booking.totalFare} BDT`);

    // 🟦 Insert QR Code (right side)
    const qrX = 420; // x position
    const qrY = 140; // y position
    doc.image(qrImage, qrX, qrY, { fit: [120, 120] });

    // ✨ Footer
    doc.moveDown(4);
    doc
      .fontSize(12)
      .fillColor("gray")
      .text("Best wishes from Rail Pass. Have a safe journey!", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
};
