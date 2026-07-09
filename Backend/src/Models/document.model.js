const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
    },

    documentType: {
      type: String,
      enum: [
        "Prescription",
        "Hospital Bill",
        "Discharge Summary",
        "Lab Report",
        "Insurance Card",
        "Medical Certificate",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);