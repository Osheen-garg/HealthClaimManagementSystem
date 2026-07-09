const Settlement = require("../Models/settlement.model");

const getMySettlements = async (req, res) => {
  try {
    const settlements = await Settlement.find({
      patient: req.user._id,
    })
      .populate("claim")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: settlements.length,
      data: settlements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMySettlements,
};