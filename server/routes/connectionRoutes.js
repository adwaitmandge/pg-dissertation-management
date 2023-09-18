const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendConnectionRequest,
  fetchConnections,
  fetchPendingConnections,
  acceptConnection,
  rejectConnection,
} = require("../controllers/connectionControllers");

router.post("/", protect, sendConnectionRequest);
router.get("/", protect, fetchConnections);
router.get("/pending", protect, fetchPendingConnections);
router.post("/accept", acceptConnection);
router.post("/reject", rejectConnection);

module.exports = router;
