const express=require("express")
const router=express.Router()
const paymentController=require("../controllers/payment.controller")

const authMiddleware=require("../middleware/auth.middleware")

router.post("/create-payment",authMiddleware,paymentController.createPayment)
router.post("/verify",authMiddleware,paymentController.verifyPayment)

module.exports=router;