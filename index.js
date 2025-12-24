require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
app.use(express.json());

/**
 * Connect to MongoDB (cached for serverless)
 */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.DB_URI, {
    bufferCommands: false,
  });

  isConnected = true;
  console.log("MongoDB connected");
}

/**
 * ✅ CRON ENDPOINT (Vercel calls this)
 */
app.get("/api/cron/expire-tasks", async (req, res) => {
  try {
    await connectDB();

    const result = await Task.updateMany(
      {
        expiresAt: { $lt: new Date() },
        status: "active",
      },
      { $set: { status: "expired" } }
    );

    console.log("Expired tasks:", result.modifiedCount);

    return res.status(200).json({
      success: true,
      expired: result.modifiedCount,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return res.status(500).json({ error: "Cron failed" });
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.status(200).json({ status: "backend is live" });
});

module.exports = app;
