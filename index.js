const { initializeDatabase } = require("./db/db.connect.js");
initializeDatabase();

const cors = require("cors");
const express = require("express");
const app = express();

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { verifyUser } = require("./middleware/auth.middleware.js");

app.get("/", (req, res) => {
  res.send("Welcome to the TravelMate AI Backend!");
});

// Auth routes
const authRoutes = require("./routes/auth.routes.js");
app.use("/auth", authRoutes);

// ai routes
const tripsRoutes = require("./routes/ai.routes.js");
app.use("/trips", verifyUser, tripsRoutes);

// trip management routes
const tripRoutes = require("./routes/trip.routes.js");
app.use("/trips", verifyUser, tripRoutes);

// featuredRoutes

const featuredRoutes = require("./routes/featured.routes.js")
app.use("/featured", featuredRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
