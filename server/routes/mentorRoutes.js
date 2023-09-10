const express = require("express");
const {
  assignTask,
  fetchStudents,
  getGoals,
  updateGoal,
  deleteGoal,
  getThesis,
  postFeedback,
} = require("../controllers/mentorControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, assignTask);
router.get("/", protect, fetchStudents);
router.get("/goals", protect, getGoals);
router.get("/thesis", protect, getThesis);
router.put("/", protect, updateGoal);
router.delete("/", protect, deleteGoal);
router.post("/thesis/feedback", protect, postFeedback);

module.exports = router;
