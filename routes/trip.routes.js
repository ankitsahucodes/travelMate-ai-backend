const express = require("express");
const router = express.Router();

const {
  saveTrip,
  getAllTrips,
} = require("../controllers/trip.controller");

router.post("/save", async (req, res) => {
  try {
    const trip = await saveTrip({
      user: req.user.userId,
      ...req.body,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({
      error: "Failed to save trip",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const trips = await getAllTrips(
      req.user.userId
    );

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch trips",
    });
  }
});

module.exports = router;