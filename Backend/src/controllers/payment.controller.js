const razorpay=require("../config/razorpay")
const crypto=require("crypto")
const Payment=require("../Models/payment.model")
const Policy=require("../Models/policy.model")
const InsurancePlan=require("../Models/insurancePlan.model")

const createPayment = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    if (req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can purchase insurance plans",
      });
    }

    const plan = await InsurancePlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    const existingPolicy = await Policy.findOne({
      patient: req.user._id,
      insurancePlan: planId,
      status: "Active",
    });

    if (existingPolicy) {
      return res.status(400).json({
        success: false,
        message: "You already have an active policy for this plan.",
      });
    }

    const options = {
      amount: plan.premium * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      key: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
      plan,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    // Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Check Plan
    const plan = await InsurancePlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    // Double-check for existing active policy
    const existingPolicy = await Policy.findOne({
      patient: req.user._id,
      insurancePlan: planId,
      status: "Active",
    });

    if (existingPolicy) {
      return res.status(409).json({
        success: false,
        message: "Active policy already exists.",
      });
    }

    // Calculate Expiry Date
   const startDate = new Date();

const expiryDate = new Date(startDate);
expiryDate.setMonth(expiryDate.getMonth() + plan.validity);

// Create Payment First
const payment = await Payment.create({
  patient: req.user._id,
  razorpayOrderId: razorpay_order_id,
  razorpayPaymentId: razorpay_payment_id,
  razorpaySignature: razorpay_signature,
  amount: plan.premium,
  status: "Success",
});

// Create Policy
const policy = await Policy.create({
  patient: req.user._id,
  insurancePlan: plan._id,
  payment: payment._id,
  policyNumber: `POL-${Date.now()}`,
  startDate,
  expiryDate,
  status: "Active",
});

// Link Policy back to Payment
payment.policy = policy._id;
await payment.save();

res.status(200).json({
  success: true,
  message: "Payment verified successfully. Policy activated.",
  payment,
  policy,
});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports={
    createPayment,
    verifyPayment
}