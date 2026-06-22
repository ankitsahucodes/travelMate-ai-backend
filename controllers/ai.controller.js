const axios = require("axios");

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
11. imageUrl is available not 404 or not available. imageUrl should be destination place image sourced from free image hosting services and it should be live not dead links.
12. Do NOT invent or generate image URLs.
13. If a verified image URL is not available, return an empty string "".
14. Never guess Unsplash image IDs or photo URLs.
15. imageUrl must be a publicly accessible direct image URL ending in .jpg, .jpeg, or .png.
16. The JSON response must be parseable with JSON.parse() without modification.
17. Top attractions must be only 3 and must be the most popular ones for the destination. Do not include less known attractions just to fill the list. the array has 3 items.
18. Estimated cost will be in INR.

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

  "imageUrl": "image url from unsplash or similar free image hosting service showing the destination during the best season to visit not from wikipedia",

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

    console.log(content);

    res.json(JSON.parse(content));
  } catch (error) {
    console.log("OpenRouter Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI generation failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { generateTrip };
