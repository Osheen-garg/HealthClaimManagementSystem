const Policy = require("../Models/policy.model");
const InsurancePlan = require("../Models/insurancePlan.model");


const getMyPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({
      patient: req.user._id,
    })
      .populate(
        "insurancePlan",
        "planName insuranceCompany coverageAmount premium validity planType"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    console.error("Get Policies Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getSinglePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate("insurancePlan");

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const cancelPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    if (policy.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Only active policies can be cancelled",
      });
    }

    policy.status = "Cancelled";

    await policy.save();

    res.status(200).json({
      success: true,
      message: "Policy cancelled successfully",
      data: policy,
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
  getMyPolicies,
  getSinglePolicy,
  cancelPolicy,
};