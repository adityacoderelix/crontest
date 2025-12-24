// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const Task = require("./models/Task");
// const cron = require("node-cron");

// const app = express();
// app.use(express.json());

// let isConnected = false;

// async function connectDB() {
//   if (isConnected) return;
//   await mongoose.connect(process.env.DB_URI);
//   isConnected = true;
//   console.log("MongoDB connected");
// }
// connectDB();
// // ✅ Correct IST cron (1:54 PM)

// cron.schedule(
//   "20 14 * * *",
//   async () => {
//     try {
//       console.log("⏰ Cron started at", new Date().toString());

//       const result = await Task.updateMany(
//         {
//           expiresAt: { $lt: new Date() },
//           status: "active",
//         },
//         { $set: { status: "expired" } }
//       );

//       console.log("Expired tasks:", result.modifiedCount);
//     } catch (err) {
//       console.error("Cron error:", err);
//     }
//   },
//   { timezone: "Asia/Kolkata" }
// );

// // Health check
// app.get("/", (req, res) => {
//   res.json({ status: "backend is live" });
// });

// // ✅ REQUIRED for cron to run locally
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.DB_URI);
  isConnected = true;
  console.log("MongoDB connected");
}

// 🔥 Vercel cron will HIT THIS ENDPOINT
app.get("/api/cron/expire-tasks", async (req, res) => {
  try {
    await connectDB();

    console.log("⏰ Cron triggered at:", new Date().toISOString());

    const result = await Task.updateMany(
      {
        expiresAt: { $lt: new Date() },
        status: "active",
      },
      { $set: { status: "expired" } }
    );

    return res.status(200).json({
      success: true,
      expired: result.modifiedCount,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: "Cron failed" });
  }
});

app.get("/api/cron-ist/expire-tasks", async (req, res) => {
  try {
    await connectDB();

    console.log("⏰ Cron triggered at:", new Date().toISOString());

    const result = await Task.updateMany(
      {
        expiresAt: { $lt: new Date() },
        status: "active",
      },
      { $set: { status: "expired" } }
    );

    return res.status(200).json({
      success: true,
      expired: result.modifiedCount,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: "Cron failed" });
  }
});
// Health check
app.get("/", (req, res) => {
  res.json({ status: "backend is live" });
});

// Local dev only
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

module.exports = app;
