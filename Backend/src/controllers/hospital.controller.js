const Claim = require("../Models/claim.model");


const getAssignedClaims = async (req, res) => {
    try {

        const claims = await Claim.find({
            hospital: req.user._id
        })
        .populate("patient", "name email phone")
        .populate({
            path: "policy",
            populate: {
                path: "insurancePlan"
            }
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


const getSingleClaim = async (req, res) => {

    try {

        const claim = await Claim.findOne({
            _id: req.params.id,
            hospital: req.user._id
        })
        .populate("patient", "name email phone address")
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

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const verifyClaim = async (req, res) => {

    try {

        const { hospitalRemarks } = req.body;

        const claim = await Claim.findOne({
            _id: req.params.id,
            hospital: req.user._id
        });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        if (claim.status !== "Hospital Assigned") {
            return res.status(400).json({
                success: false,
                message: "Claim cannot be verified."
            });
        }

        claim.status = "Hospital Verified";
        claim.hospitalRemarks = hospitalRemarks;
        claim.verifiedBy = req.user._id;
        claim.verifiedAt = new Date();

        await claim.save();

        res.status(200).json({
            success: true,
            message: "Claim verified successfully",
            data: claim
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getAssignedClaims,
    getSingleClaim,
    verifyClaim
};