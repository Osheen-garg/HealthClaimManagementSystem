const express = require("express");

const router = express.Router();

const hospitalController = require("../controllers/hospital.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get(
    "/claims",
    authMiddleware,
    authorize("hospital"),
    hospitalController.getAssignedClaims
);

router.get(
    "/claims/:id",
    authMiddleware,
    authorize("hospital"),
    hospitalController.getSingleClaim
);

router.patch(
    "/claims/:id/verify",
    authMiddleware,
    authorize("hospital"),
    hospitalController.verifyClaim
);

module.exports = router;