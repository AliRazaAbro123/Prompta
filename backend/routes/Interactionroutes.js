const express = require("express");
const router  = express.Router();
const {
  toggleLike,
  getLikeStatus,
  trackCopy,
} = require("../controllers/interactionController");

// Agar optional auth middleware hai toh yahan lagao:
// const { optionalAuth } = require("../middleware/auth");
// router.use(optionalAuth);

router.get ("/like/:promptId", getLikeStatus); // like status + count
router.post("/like/:promptId", toggleLike);    // like / unlike toggle
router.post("/copy/:promptId", trackCopy);     // copy text + track

module.exports = router;