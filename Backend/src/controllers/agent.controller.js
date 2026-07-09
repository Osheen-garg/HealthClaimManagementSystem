const Claim = require("../Models/claim.model");

const getAssignedClaims = async (req, res) => {

    try {

        const claims = await Claim.find({
            agent: req.user._id
        })
        .populate("patient", "name email phone")
        .populate("policy")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getSingleClaim = async (req, res) => {

    try {

        const claim = await Claim.findOne({
            _id: req.params.id,
            agent: req.user._id
        })
        .populate("patient")
        .populate({
            path: "policy",
            populate: {
                path: "insurancePlan"
            }
        });

        if (!claim) {

            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });

        }

        res.status(200).json({
            success: true,
            data: claim
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const reviewClaim = async (req, res) => {

    try {

        const { recommendation, remarks } = req.body;

        const claim = await Claim.findOne({
            _id: req.params.id,
            agent: req.user._id
        });

        if (!claim) {

            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });

        }

        if (claim.status !== "Agent Assigned") {

            return res.status(400).json({
                success: false,
                message: "Invalid claim status"
            });

        }

        claim.agentRecommendation = recommendation;
        claim.agentRemarks = remarks;
        claim.reviewedBy = req.user._id;
        claim.reviewedAt = new Date();
        claim.status = "Agent Reviewed";

        await claim.save();

        res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            data: claim
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getAssignedClaims,
    getSingleClaim,
    reviewClaim
};