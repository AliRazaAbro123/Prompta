const mongoose = require("mongoose");
const User = require("../models/User");       // ✅ ADD THIS
const Category = require("../models/Category"); // ✅ ADD THIS

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    beforeImage: {
      type: String, // URL
      required: true,
    },

    afterImage: {
      type: String, // URL
      required: true,
    },

    promptText: {
      type: String,
      required: true,
      select: false, // 🔥 hidden by default
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    totalLikes: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      enum: ["community", "library"], // 🔥 your main requirement
      default: "community",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema);