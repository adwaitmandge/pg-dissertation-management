const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const {
  getGoals,
  createGoal,
  completeGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalControllers");

router.get("/goals", protect, getGoals);
router.post("/goals", protect, createGoal);
router.patch("/goals", protect, completeGoal);
router.put("/goals", protect, updateGoal);
router.delete("/goals", protect, deleteGoal);

module.exports = router;
