const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelMateUser",
      required: true,
    },

    destination: String,
    country: String,

    duration_days: Number,
    person_count: Number,

    currency: String,

    budget_inr: Number,

    best_time_to_visit: {
      season: String,
      reason: String,
    },

    imageUrl: String,

    top_attractions: [String],

    travel_tips: [String],

    days: [
      {
        day: Number,
        title: String,
        estimated_day_cost: Number,

        activities: [
          {
            time: String,
            activity: String,
            location: String,
            description: String,
            estimated_cost: Number,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TravelMateTrip",
  tripSchema
);