const express = require("express");

const router = express.Router();

const settlementController = require("../controllers/settlement.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/my-settlements",
  authMiddleware,
  settlementController.getMySettlements
);

module.exports = router;