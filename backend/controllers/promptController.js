const Prompt = require("../models/prompt");
const Category = require("../models/category");
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

// DELETE SINGLE PROMPT
exports.deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return res.status(404).json({
        message: "Prompt not found",
      });
    }

    res.status(200).json({
      message: "Prompt deleted successfully",
      deletedPrompt,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// DELETE ALL PROMPTS
exports.deleteAllPrompts = async (req, res) => {
  try {
    await Prompt.deleteMany();

    res.status(200).json({
      message: "All prompts deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ── ADD THESE TWO FUNCTIONS to your promptController.js ──────────────────────
 
// GET LIBRARY PROMPTS
exports.getLibraryPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ type: "library", isPublic: true })
      .populate({ path: "category", select: "name", strictPopulate: false })
      .select("-promptText") // hide prompt text in list
      .sort({ createdAt: -1 });
 
    res.status(200).json({ total: prompts.length, prompts });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
 
// GET SINGLE PROMPT TEXT (for copy button)
exports.getPromptText = async (req, res) => {
  try {
    const { id } = req.params;
 
    const prompt = await Prompt.findById(id).select("+promptText");
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
 
    res.status(200).json({ promptText: prompt.promptText });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};