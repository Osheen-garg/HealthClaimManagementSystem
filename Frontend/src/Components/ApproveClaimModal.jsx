import { useState } from "react";
import { toast } from "react-toastify";

import { approveClaim } from "../services/adminClaimService";

const ApproveClaimModal = ({
  isOpen,
  onClose,
  claimId,
  onSuccess,
}) => {
  const [approvedAmount, setApprovedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!approvedAmount) {
      return toast.error("Please enter approved amount.");
    }

    if (Number(approvedAmount) <= 0) {
      return toast.error("Amount must be greater than zero.");
    }

    try {
      setLoading(true);

     await approveClaim(claimId, approvedAmount);

      toast.success("Claim Approved Successfully");

      onSuccess();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to approve claim."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-6">
          Approve Claim
        </h2>

        <div className="space-y-4">

          <div>

            <label className="block font-semibold mb-2">
              Approved Amount
            </label>

            <input
              type="number"
              value={approvedAmount}
              onChange={(e) =>
                setApprovedAmount(e.target.value)
              }
              placeholder="Enter approved amount"
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Approving..." : "Approve"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ApproveClaimModal;