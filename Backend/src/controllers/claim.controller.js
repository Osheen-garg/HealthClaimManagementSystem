const Claim =require("../Models/claim.model")
const Policy=require("../Models/policy.model")

const submitClaim = async (req, res) => {
  try {
    const {
      policyId,
      claimAmount,
      diagnosis,
      treatmentDescription,
      admissionDate,
      dischargeDate,
    } = req.body;

    if (
      !policyId ||
      !claimAmount ||
      !diagnosis ||
      !treatmentDescription ||
      !admissionDate ||
      !dischargeDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const policy = await Policy.findOne({
      _id: policyId,
      patient: req.user._id,
      status: "Active",
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Active policy not found",
      });
    }

    const claimNumber =
      "CLM-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 1000);

    const claim = await Claim.create({
      patient: req.user._id,
      policy: policyId,
      claimNumber,
      claimAmount,
      diagnosis,
      treatmentDescription,
      admissionDate,
      dischargeDate,
    });

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      data: claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      patient: req.user._id,
    })
      .populate({
        path: "policy",
        populate: {
          path: "insurancePlan",
        },
      })
      .populate({
    path: "hospital",
    select: "name email phone address",
  })
  .populate({
    path: "agent",
    select: "name email phone",
  })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getSingleClaim = async (req, res) => {
  try {
    const claim = await Claim.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate({
      path: "policy",
      populate: {
        path: "insurancePlan",
      },
    }).populate({
    path: "hospital",
    select: "name email phone address",
  })
  .populate({
    path: "agent",
    select: "name email phone",
  });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  submitClaim,
  getMyClaims,
  getSingleClaim,
};