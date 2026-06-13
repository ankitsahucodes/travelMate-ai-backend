const express = require("express");
const router = express.Router();

const {
  saveTrip,
  getAllTrips,
  getTripById,
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
    const trips = await getAllTrips(req.user.userId);

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch trips",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await getTripById(req.params.id, req.user.userId);

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch trip",
    });
  }
});

module.exports = router;
