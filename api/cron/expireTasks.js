const connectDB = require("../../lib/db");
const Task = require("../../models/Task");

module.exports = async (req, res) => {
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
  } catch (err) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: "Cron failed" });
  }
};
