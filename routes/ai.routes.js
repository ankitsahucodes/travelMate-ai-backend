const express = require("express");
const router = express.Router();

const { generateTrip } = require("../controllers/ai.controller");

router.post("/create", generateTrip);

module.exports = router;