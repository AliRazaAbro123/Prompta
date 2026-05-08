const express = require("express");
const router = express.Router();

const { createPrompt } = require("../controllers/promptController");
const { getCommunityPrompts } = require("../controllers/promptController");

// Create Prompt
router.post("/", createPrompt);

// Get Community Prompts
router.get("/community", getCommunityPrompts);

module.exports = router;