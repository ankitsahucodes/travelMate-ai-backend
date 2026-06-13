const express = require("express");
const router = express.Router();

const featuredTrips = require("../data/featuredTrips.json");

router.get("/trip", (req, res) => {
  res.status(200).json(featuredTrips);
});

router.get("/:id", (req, res) => {
  const trip = featuredTrips.find(
    (trip) => trip.id === Number(req.params.id)
  );

  if (!trip) {
    return res.status(404).json({
      error: "Trip not found",
    });
  }

  res.json(trip);
});

module.exports = router;