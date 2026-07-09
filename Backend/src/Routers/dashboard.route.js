const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getPatientDashboard,
  getAdminDashboard,
  getHospitalDashboard,
  getAgentDashboard,
} = require("../controllers/dashboard.controller");

router.get(
  "/patient",
  authMiddleware,
  authorize("patient"),
  getPatientDashboard
);

router.get(
  "/admin",
  authMiddleware,
  authorize("admin"),
  getAdminDashboard
);

router.get(
  "/hospital",
  authMiddleware,
  authorize("hospital"),
  getHospitalDashboard
);

router.get(
  "/agent",
  authMiddleware,
 authorize("agent"),
  getAgentDashboard
);

module.exports = router;