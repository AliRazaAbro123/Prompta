const express = require("express");
const router = express.Router();

const {
  createPrompt,
  getCommunityPrompts,
  getLibraryPrompts,
  getPromptText,
  deletePrompt,
  deleteAllPrompts,
} = require("../controllers/promptController");

// Create Prompt
router.post("/", createPrompt);

// Get Community Prompts
router.get("/community", getCommunityPrompts);

// DELETE ONE
router.delete("/:id", deletePrompt);

// DELETE ALL
router.delete("/", deleteAllPrompts);

router.get("/library",              getLibraryPrompts);       // ← naya
router.get("/:id/prompt-text",      getPromptText);    

module.exports = router;