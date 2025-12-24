const cron = require("node-cron");
const Task = require("../models/Task");

const startExpireCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running daily expiration job");

    try {
      const result = await Task.updateMany(
        {
          expiresAt: { $lt: new Date() },
          status: "active",
        },
        {
          $set: { status: "expired" },
        }
      );

      console.log("Expired tasks:", result.modifiedCount);
    } catch (error) {
      console.error("Cron error:", error);
    }
  });
};

module.exports = startExpireCron;
