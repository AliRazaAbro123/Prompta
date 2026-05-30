const mongoose = require("mongoose");

const copySchema = new mongoose.Schema(
  {
    // Registered user (optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Anonymous user — cookie se milne wala UUID
    anonymousId: {
      type: String,
      default: null,
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Copy", copySchema);