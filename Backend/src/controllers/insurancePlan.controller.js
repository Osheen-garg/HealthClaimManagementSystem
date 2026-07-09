const InsurancePlan=require("../Models/insurancePlan.model")

const createInsurancePlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.create(req.body);

    res.status(201).json({
      success: true,
      message: "Insurance plan created successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllInsurancePlans = async (req, res) => {
  try {
    const plans = await InsurancePlan.find();

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInsurancePlanById = async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInsurancePlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Insurance plan updated successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInsurancePlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Insurance plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInsurancePlan,
  getAllInsurancePlans,
  getInsurancePlanById,
  updateInsurancePlan,
  deleteInsurancePlan,
};