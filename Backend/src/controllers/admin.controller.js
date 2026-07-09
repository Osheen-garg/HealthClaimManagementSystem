const bcrypt = require("bcryptjs");
const Claim = require("../Models/claim.model");
const User = require("../Models/user.model");
const Settlement=require("../Models/settlement.model")
const {
  sendCredentialsEmail,
} = require("../services/mail.service");

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      role,
    } = req.body;

    if (!["hospital", "agent"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Only Hospital or Agent can be created.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Generate temporary password
    const tempPassword =
      Math.random().toString(36).slice(-8) + "@123";

    const hashedPassword = await bcrypt.hash(
      tempPassword,
      10
    );

    const user = await User.create({
      name,
      email,
      phone,
      address,
      role,
      password: hashedPassword,
    });

    // Send credentials email
    await sendCredentialsEmail(
      email,
      name,
      tempPassword,
      role
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message:
        "User created successfully. Login credentials have been sent by email.",
      data: userResponse,
    });
  } catch (error) {
    console.error("Create User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const assignHospital = async (req, res) => {

    try {

        const { hospitalId } = req.body;

        const claimId = req.params.id;

        if (!hospitalId) {

            return res.status(400).json({
                success: false,
                message: "Hospital ID is required"
            });

        }

        const hospital = await User.findOne({
            _id: hospitalId,
            role: "hospital"
        });

        if (!hospital) {

            return res.status(404).json({
                success: false,
                message: "Hospital not found"
            });

        }

        const claim = await Claim.findById(claimId);

        if (!claim) {

            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });

        }

        claim.hospital = hospitalId;

        claim.status = "Hospital Assigned";

        await claim.save();

        res.status(200).json({

            success: true,

            message: "Hospital assigned successfully",

            data: claim

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const assignAgent = async (req, res) => {

    try {

        const { agentId } = req.body;

        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        if (claim.status !== "Hospital Verified") {
            return res.status(400).json({
                success: false,
                message: "Claim must be hospital verified first."
            });
        }

        const agent = await User.findOne({
            _id: agentId,
            role: "agent"
        });

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found"
            });
        }

        claim.agent = agentId;
        claim.status = "Agent Assigned";

        await claim.save();

        res.status(200).json({
            success: true,
            message: "Agent assigned successfully",
            data: claim
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const approveClaim = async (req, res) => {
  try {
    const { approvedAmount } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (claim.status !== "Agent Reviewed") {
      return res.status(400).json({
        success: false,
        message: "Claim must be reviewed by an agent first.",
      });
    }

    claim.status = "Approved";
    claim.approvedAmount = approvedAmount;
    claim.approvedBy = req.user._id;
    claim.approvedAt = new Date();

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim approved successfully.",
      data: claim,
    });
  } catch (error) {
    console.error("Approve Claim Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectClaim = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (claim.status !== "Agent Reviewed") {
      return res.status(400).json({
        success: false,
        message: "Claim must be reviewed by an agent first.",
      });
    }

    claim.status = "Rejected";
    claim.rejectionReason = rejectionReason;
    claim.approvedBy = req.user._id;
    claim.approvedAt = new Date();

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim rejected successfully.",
      data: claim,
    });
  } catch (error) {
    console.error("Reject Claim Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markClaimAsPaid = async (req, res) => {
  try {
   const paymentMethod = req.body?.paymentMethod || "Bank Transfer";

    const claim = await Claim.findById(req.params.id)
      .populate("patient")
      .populate("policy");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (claim.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved claims can be paid.",
      });
    }

    const existingSettlement = await Settlement.findOne({
      claim: claim._id,
    });

    if (existingSettlement) {
      return res.status(400).json({
        success: false,
        message: "Settlement already exists.",
      });
    }

    const transactionId = `TXN-${Date.now()}`;

    const settlement = await Settlement.create({
      claim: claim._id,
      patient: claim.patient._id,
      amount: claim.approvedAmount,
      paymentMethod,
      transactionId,
    });

    claim.status = "Paid";
    claim.paidAt = new Date();

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim settled successfully.",
      settlement,
      claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("patient", "name email phone")
      .populate("policy", "policyNumber")
      .populate("hospital", "name email")
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: claims,
    });
  } catch (error) {
    console.error("Get All Claims Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findById(id)
      .populate("patient", "name email phone address")
      .populate("policy")
      .populate("hospital", "name email phone")
      .populate("agent", "name email phone")
      .populate("verifiedBy", "name")
      .populate("reviewedBy", "name")
      .populate("approvedBy", "name")
      .populate({
  path: "policy",
  populate: {
    path: "insurancePlan",
    select: "planName coverageAmount premium",
  },
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
    console.error("Get Claim Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getHospitals = async (req, res) => {
  try {
    const hospitals = await User.find(
      { role: "hospital" },
      "name email phone address"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: hospitals,
    });
  } catch (error) {
    console.error("Get Hospitals Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await User.find(
      { role: "agent" },
      "name email phone address"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error("Get Agents Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["hospital", "agent"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, role } = req.body;

    const user = await User.findById(req.params.id);
    const existingUser = await User.findOne({
  email,
  _id: { $ne: req.params.id },
});

if (existingUser) {
  return res.status(400).json({
    success: false,
    message: "Email already exists",
  });
}

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
    createUser,
    assignHospital,
    assignAgent,
    approveClaim,
    rejectClaim,
    markClaimAsPaid,
    getAllClaims,
    getClaimById,
    getHospitals,
    getAgents,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};