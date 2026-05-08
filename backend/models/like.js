const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
    },
    type: {
      type: String,
      enum: ["like", "save", "view"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interaction", interactionSchema);