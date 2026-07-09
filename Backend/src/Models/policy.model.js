const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    // Patient
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   
    insurancePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePlan",
      required: true,
    },

   
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    // Unique Policy Number
    policyNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Policy Dates
    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    // Policy Status
    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Active",
        "Expired",
        "Cancelled",
      ],
      default: "Pending Payment",
    },

    // Renewal
    isRenewed: {
      type: Boolean,
      default: false,
    },

    renewedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Policy", policySchema);