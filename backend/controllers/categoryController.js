const Category = require("../models/Category");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check duplicate
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create
    const category = await Category.create({
      name,
      icon,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};