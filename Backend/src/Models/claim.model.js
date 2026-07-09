const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    // Patient who raised the claim
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Purchased Policy
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },

    // Hospital handling the treatment
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Insurance Agent reviewing the claim
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    claimNumber: {
      type: String,
      unique: true,
      required: true,
    },

    claimAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    treatmentDescription: {
      type: String,
      required: true,
    },

    admissionDate: {
      type: Date,
      required: true,
    },

    dischargeDate: {
      type: Date,
      required: true,
    },

    documents: [
      {
        documentType: {
          type: String,
          enum: [
            "Bill",
            "Prescription",
            "Discharge Summary",
            "Medical Report",
            "Other",
          ],
        },
        fileUrl: String,
      },
    ],

  status: {
    type: String,
    enum: [
        "Submitted",
        "Hospital Assigned",
        "Hospital Verified",
        "Agent Assigned",
        "Agent Reviewed",
        "Approved",
        "Rejected",
        "Paid"
    ],
    default: "Submitted",
},

    rejectionReason: {
      type: String,
      default: "",
    },

    approvedAmount: {
      type: Number,
      default: 0,
    },
    hospitalRemarks: {
      type: String,
      default: "",
      },

verifiedAt: {
  type: Date,
},

verifiedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
agentRecommendation: {
    type: String,
    enum: ["Approve", "Reject", "Pending"],
    default: "Pending",
},

agentRemarks: {
    type: String,
    default: "",
},

reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
},

reviewedAt: {
    type: Date,
    default: null,
},
approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
approvedAt: {
  type: Date,
  default: null,
},

paidAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Claim", claimSchema);