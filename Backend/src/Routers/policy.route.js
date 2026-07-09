const express = require("express");

const router = express.Router();
const policyController=require("../controllers/policy.controller")
const authMiddleware=require("../middleware/auth.middleware")
const authorize=require("../middleware/role.middleware");

router.get(
  "/my-policies",
  authMiddleware,
  authorize("patient"),
  policyController.getMyPolicies
);

router.get(
  "/:id",
  authMiddleware,
  authorize("patient"),
  policyController.getSinglePolicy
);

router.patch(
  "/cancel/:id",
  authMiddleware,
  authorize("patient"),
  policyController.cancelPolicy
);

module.exports = router;