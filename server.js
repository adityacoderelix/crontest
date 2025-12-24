require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI
      //"mongodb+srv://admin:10VToU0WupyAbo4M@majestic-escape.nk49u.mongodb.net/master-db?retryWrites=true&w=majority&appName=Majestic-Escape&authSource=admin"
    );
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};
connectDB();
// ✅ CRON ENDPOINT (Vercel calls this)
app.get("/api/cron/expire-tasks", async (req, res) => {
  try {
    const result = await Task.updateMany(
      {
        expiresAt: { $lt: new Date() },
        status: "active",
      },
      { $set: { status: "expired" } }
    );

    console.log("Expired tasks:", result.modifiedCount);
    res.status(200).send("Cron executed successfully");
  } catch (error) {
    console.error("Cron error:", error);
    res.status(500).send("Cron failed");
  }
});

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "backend is live",
    server: " Server is running",
  });
});

module.exports = app;
