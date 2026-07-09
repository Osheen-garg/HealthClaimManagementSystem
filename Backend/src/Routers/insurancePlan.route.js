const express = require("express");

const router = express.Router();

const insurancePlanController=require("../controllers/insurancePlan.controller")
const authMiddleware=require("../middleware/auth.middleware")
const authorize=require("../middleware/role.middleware");
const { route } = require("./auth.route");

router.get("/",insurancePlanController.getAllInsurancePlans)
router.get("/:id",insurancePlanController.getInsurancePlanById)

router.post("/",authMiddleware,authorize("admin"),insurancePlanController.createInsurancePlan)
router.put("/:id",authMiddleware,authorize("admin"),insurancePlanController.updateInsurancePlan)
router.delete("/:id",authMiddleware,authorize("admin"),insurancePlanController.deleteInsurancePlan)

module.exports=router;
