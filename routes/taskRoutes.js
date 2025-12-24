const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

module.exports = router;
