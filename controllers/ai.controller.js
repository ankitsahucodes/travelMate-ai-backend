const axios = require("axios");

const DEFAULT_IMAGE =
  "https://plus.unsplash.com/premium_photo-1661501359079-b362cda0d5d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const getDestinationImage = async (destination) => {
  try {
    const response = await axios.get("https://api.pexels.com/v1/search", {
      params: {
        query: destination,
        per_page: 1,
      },
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    return response.data?.photos?.[0]?.src?.large || DEFAULT_IMAGE;
  } catch (error) {
    console.log("Pexels Error:", error.message);
    return DEFAULT_IMAGE;
  }
};

const generateTrip = async (req, res) => {
  try {
    const { destination, days, persons, budget } = req.body;

    const SYSTEM_PROMPT = `
You are TravelMate AI, an expert travel planner.

Your task is to generate realistic, budget-conscious travel itineraries.

Rules:
1. Return ONLY valid JSON.
2. Do NOT include markdown, explanations, notes, or code blocks.
3. All costs must be in INR.
4. Ensure activities are realistic for the destination and travel duration.
5. Distribute activities evenly across days.
6. Include famous attractions, local experiences, food recommendations, and transportation suggestions when relevant.
7. Keep the itinerary within the user's budget.
8. Provide concise but useful descriptions.
9. Return all fields requested by the user schema.
10. If information is unavailable, use an empty string or empty array instead of inventing data.
11. The JSON response must be parseable with JSON.parse() without modification.
12. Top attractions must be only 3 and must be the most popular ones for the destination. Do not include less known attractions just to fill the list. the array has 3 items.
13. Estimated cost will be in INR.

Generate a complete travel plan based on destination, duration, person count, and budget.
`;

    const USER_PROMPT = `
Create a detailed travel itinerary.

Destination: ${destination}
Person: ${persons} person(s)
Duration: ${days} days
Budget: ${budget} INR

Requirements:
- Determine the destination's local currency.
- Convert the budget from INR to the local currency approximately.
- Keep the itinerary within the specified budget.
- Include popular attractions, local experiences, food recommendations, and transportation suggestions.
- Distribute activities realistically across all days.
- Provide estimated costs for each activity.
- Return ONLY valid JSON.

Return JSON in the following exact structure:

{
  "destination": "",
  "country": "",
  "duration_days": 0,
  "person_count": 0,

  "currency": "",
  "budget_inr": 0,

  "best_time_to_visit": {
    "season": "",
    "reason": ""
  },


  "top_attractions": [
    "string", "string", "string"
  ],

  "travel_tips": [
    "string", "string", "string" 3-4 concise, practical tips for travelers to this destination
  ],

  "days": [
    {
      "day": 1,
      "title": "",
      "estimated_day_cost": 0,
      "activities": [
        {
          "time": "morning/afternoon/evening",
          "activity": "",
          "location": "",
          "description": "",
          "estimated_cost": 0
        }
      ]
    }
  ]
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-4-26b-a4b-it",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: USER_PROMPT,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response.data.choices[0].message.content;

    const trip = JSON.parse(content);

    // Fetch image from Pexels
    trip.imageUrl = await getDestinationImage(trip.destination || destination);

    console.log(trip);

    res.json(trip);
  } catch (error) {
    console.log("OpenRouter Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI generation failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { generateTrip };
