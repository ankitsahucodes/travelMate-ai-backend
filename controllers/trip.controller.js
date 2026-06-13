const TravelMateTrip = require("../models/trip.model");

async function saveTrip(tripData) {
  try {
    const trip = new TravelMateTrip(tripData);

    const savedTrip = await trip.save();

    return savedTrip;
  } catch (error) {
    throw error;
  }
}

async function getAllTrips(userId) {
  try {
    const trips = await TravelMateTrip.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return trips;
  } catch (error) {
    throw error;
  }
}

async function getTripById(tripId, userId) {
  try {
    const trip = await TravelMateTrip.findOne({
      _id: tripId,
      user: userId,
    });

    return trip;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveTrip,
  getAllTrips,
  getTripById
};