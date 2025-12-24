require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// ✅ CRON ENDPOINT (Vercel calls this)
app.get("/cron/expire-tasks", async (req, res) => {
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
  res.send("Server is running");
});

module.exports = app;
