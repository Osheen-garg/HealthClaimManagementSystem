const Policy = require("../Models/policy.model");
const Claim = require("../Models/claim.model");
const User = require("../Models/user.model");
const InsurancePlan = require("../Models/insurancePlan.model");


// ================= PATIENT DASHBOARD =================

const getPatientDashboard = async (req, res) => {
  try {
    const patientId = req.user._id;

    const [
      activePolicies,
      totalClaims,
      approvedClaims,
      pendingClaims,
      recentPolicies,
    ] = await Promise.all([
      Policy.countDocuments({
        patient: patientId,
        status: "Active",
      }),

      Claim.countDocuments({
        patient: patientId,
      }),

      Claim.countDocuments({
        patient: patientId,
        status: "Approved",
      }),

      Claim.countDocuments({
        patient: patientId,
        status: {
          $in: [
            "Submitted",
            "Hospital Assigned",
            "Hospital Verified",
            "Agent Assigned",
            "Agent Reviewed",
          ],
        },
      }),

      Policy.find({ patient: patientId })
        .populate("insurancePlan", "planName premium")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        activePolicies,
        totalClaims,
        approvedClaims,
        pendingClaims,
        recentPolicies,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ================= ADMIN DASHBOARD =================

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalPatients,
      totalHospitals,
      totalAgents,
      totalPlans,
      totalPolicies,
      totalClaims,
      approvedClaims,
      rejectedClaims,
      pendingClaims,
      paidClaims,
      recentClaims,
    ] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "hospital" }),
      User.countDocuments({ role: "agent" }),
      InsurancePlan.countDocuments(),
      Policy.countDocuments(),
      Claim.countDocuments(),

      Claim.countDocuments({ status: "Approved" }),

      Claim.countDocuments({ status: "Rejected" }),

      Claim.countDocuments({
        status: {
          $in: [
            "Submitted",
            "Hospital Assigned",
            "Hospital Verified",
            "Agent Assigned",
            "Agent Reviewed",
          ],
        },
      }),

      Claim.countDocuments({
        status: "Paid",
      }),

      Claim.find()
        .populate("patient", "name")
        .populate("policy", "policyNumber")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.json({
      success: true,
      data: {
        totalPatients,
        totalHospitals,
        totalAgents,
        totalPlans,
        totalPolicies,
        totalClaims,
        approvedClaims,
        rejectedClaims,
        pendingClaims,
        paidClaims,
        recentClaims,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ================= HOSPITAL DASHBOARD =================

const getHospitalDashboard = async (req, res) => {
  try {
    const hospitalId = req.user._id;

    const [
      assignedClaims,
      verifiedClaims,
      pendingClaims,
      recentClaims,
    ] = await Promise.all([
      Claim.countDocuments({
        hospital: hospitalId,
      }),

      Claim.countDocuments({
        hospital: hospitalId,
        status: "Hospital Verified",
      }),

      Claim.countDocuments({
        hospital: hospitalId,
        status: "Hospital Assigned",
      }),

      Claim.find({
        hospital: hospitalId,
      })
        .populate("patient", "name")
        .populate("policy", "policyNumber")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.json({
      success: true,
      data: {
        assignedClaims,
        verifiedClaims,
        pendingClaims,
        recentClaims,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ================= AGENT DASHBOARD =================

const getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user._id;

    const [
      assignedClaims,
      reviewedClaims,
      pendingClaims,
      recentClaims,
    ] = await Promise.all([
      Claim.countDocuments({
        agent: agentId,
      }),

      Claim.countDocuments({
        agent: agentId,
        status: "Agent Reviewed",
      }),

      Claim.countDocuments({
        agent: agentId,
        status: "Agent Assigned",
      }),

      Claim.find({
        agent: agentId,
      })
        .populate("patient", "name")
        .populate("policy", "policyNumber")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.json({
      success: true,
      data: {
        assignedClaims,
        reviewedClaims,
        pendingClaims,
        recentClaims,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  getPatientDashboard,
  getAdminDashboard,
  getHospitalDashboard,
  getAgentDashboard,
};