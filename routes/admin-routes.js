const express = require("express");
const { approveStoreRequest } = require("../controllers/adminController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/approveStore",
  authenticateToken,
  authorizeRole("admin"),
  approveStoreRequest
);

module.exports = router;
