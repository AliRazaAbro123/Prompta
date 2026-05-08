const Prompt = require("../models/Prompt");
const Category = require("../models/Category");

// CREATE PROMPT
exports.createPrompt = async (req, res) => {
  try {
    const {
      title,
      beforeImage,
      afterImage,
      promptText,
      categoryId,
      type, // "community" or "library"
    } = req.body;

    // 🔎 Validation
    if (!title || !beforeImage || !afterImage || !promptText || !categoryId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Check category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // 🚀 Create Prompt
    const prompt = await Prompt.create({
      title,
      beforeImage,
      afterImage,
      promptText,
      category: categoryId,
      createdBy: req.user ? req.user._id : null, // future auth
      type: type || "community",
    });

    res.status(201).json({
      message: "Prompt created successfully",
      prompt,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getCommunityPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({
      type: "community",
      isPublic: true,
    })
      .populate({ path: "category", select: "name", strictPopulate: false })
      .populate({ path: "createdBy", select: "name", strictPopulate: false })
      .select("-promptText")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: prompts.length,
      prompts,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};