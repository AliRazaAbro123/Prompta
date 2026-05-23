const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: String,
  },
  { timestamps: true }
);

// 🔥 FIX: Prevent OverwriteModelError
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);