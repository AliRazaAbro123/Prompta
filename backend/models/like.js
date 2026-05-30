const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["like", "save", "view"],
      required: true,
    },
  },
  { timestamps: true }
);

// Registered user: ek prompt pe ek like
interactionSchema.index(
  { user: 1, prompt: 1, type: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { user: { $ne: null } },
  }
);

// Anonymous user: ek prompt pe ek like
interactionSchema.index(
  { anonymousId: 1, prompt: 1, type: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { anonymousId: { $ne: null } },
  }
);

module.exports = mongoose.model("Interaction", interactionSchema);