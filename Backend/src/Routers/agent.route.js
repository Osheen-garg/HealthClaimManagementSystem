const express = require("express");

const router = express.Router();

const controller = require("../controllers/agent.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get(
    "/claims",
    authMiddleware,
    authorize("agent"),
    controller.getAssignedClaims
);

router.get(
    "/claims/:id",
    authMiddleware,
    authorize("agent"),
    controller.getSingleClaim
);

router.patch(
    "/claims/:id/review",
    authMiddleware,
    authorize("agent"),
    controller.reviewClaim
);

module.exports = router;