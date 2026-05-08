const mongoose = require("mongoose");

const copySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Copy", copySchema);