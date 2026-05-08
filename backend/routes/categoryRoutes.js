const express = require("express");
const router = express.Router();

const { createCategory } = require("../controllers/categoryController");

// Create Category (Admin)
router.post("/", createCategory);

module.exports = router;