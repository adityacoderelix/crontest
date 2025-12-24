require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const cron = require("node-cron");

const app = express();
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.DB_URI);
  isConnected = true;
  console.log("MongoDB connected");
}
connectDB();
// ✅ Correct IST cron (1:54 PM)
app.get(
  "/api/cron/expire-tasks",
  async (req, res) => {
    // cron.schedule(
    //   "20 14 * * *",
    //   async () => {
    try {
      console.log("⏰ Cron started at", new Date().toString());

      const result = await Task.updateMany(
        {
          expiresAt: { $lt: new Date() },
          status: "active",
        },
        { $set: { status: "expired" } }
      );

      console.log("Expired tasks:", result.modifiedCount);
    } catch (err) {
      console.error("Cron error:", err);
    }
  },
  { timezone: "Asia/Kolkata" }
);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "backend is live" });
});

// ✅ REQUIRED for cron to run locally
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
