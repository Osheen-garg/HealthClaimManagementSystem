const express = require("express");

const router = express.Router();

const claimController = require("../controllers/claim.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  authorize("patient"),
  claimController.submitClaim
);

router.get(
  "/my-claims",
  authMiddleware,
  authorize("patient"),
  claimController.getMyClaims
);

router.get(
  "/:id",
  authMiddleware,
  authorize("patient"),
  claimController.getSingleClaim
);

module.exports = router;