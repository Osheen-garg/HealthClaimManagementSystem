// models/InsurancePlan.js

const mongoose = require("mongoose");

const insurancePlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
    },

    insuranceCompany: {
      type: String,
      required: true,
    },

    planType: {
      type: String,
      enum: ["Individual", "Family", "Senior Citizen"],
      required: true,
    },

    coverageAmount: {
      type: Number,
      required: true,
    },

    premium: {
      type: Number,
      required: true,
    },

    waitingPeriod: {
      type: Number,
      default: 0,
    },

    validity: {
      type: Number, // in months
      default: 12,
    },

    benefits: [
      {
        type: String,
      },
    ],

    exclusions: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InsurancePlan", insurancePlanSchema);