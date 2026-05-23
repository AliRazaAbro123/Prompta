const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Google DNS

// Load environment variables
require("dotenv").config();
const categoryRoutes = require("./routes/categoryRoutes");
const promptRoutes = require("./routes/promptRoutes");
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(
  cors({
    origin: "*", // sab allow (development)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Use Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/prompts", promptRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ DB Error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;