const express = require("express");

const router = express.Router();

const adminController=require("../controllers/admin.controller")
const authMiddleware=require("../middleware/auth.middleware")
const authorize=require("../middleware/role.middleware")

router.post(
  "/create-user",
  authMiddleware,
  authorize("admin"),
  adminController.createUser
);
// User Management
router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  adminController.getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  adminController.getUserById
);

router.put(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  adminController.updateUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  adminController.deleteUser
);

router.patch(
    "/claims/:id/assign-hospital",
    authMiddleware,
    authorize("admin"),
    adminController.assignHospital
);

router.patch(
    "/claims/:id/assign-agent",
    authMiddleware,
    authorize("admin"),
    adminController.assignAgent
);

router.patch(
  "/claims/:id/approve",
  authMiddleware,
  authorize("admin"),
  adminController.approveClaim
);

router.patch(
  "/claims/:id/reject",
  authMiddleware,
  authorize("admin"),
  adminController.rejectClaim
);

router.patch(
  "/claims/:id/pay",
  authMiddleware,
  authorize("admin"),
  adminController.markClaimAsPaid
);



router.get(
  "/claims",
  authMiddleware,
  authorize("admin"),
  adminController.getAllClaims
);

router.get(
  "/claims/:id",
  authMiddleware,
  authorize("admin"),
  adminController.getClaimById
);

router.get(
  "/hospitals",
  authMiddleware,
  authorize("admin"),
  adminController.getHospitals
);

router.get(
  "/agents",
  authMiddleware,
  authorize("admin"),
  adminController.getAgents
);

module.exports = router;